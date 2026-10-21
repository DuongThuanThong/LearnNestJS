import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service.js';

export type FindBooksParams = {
  skip: number;
  take: number;
  search?: string;
  categoryId?: string;
};

@Injectable()
export class BooksRepository {
  constructor(private readonly prisma: PrismaService) {}

  private buildWhere(params: FindBooksParams): Prisma.BookWhereInput {
    return {
      ...(params.categoryId ? { categoryId: params.categoryId } : {}),
      ...(params.search
        ? {
            OR: [
              { title: { contains: params.search, mode: 'insensitive' } },
              { author: { contains: params.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };
  }

  async findMany(params: FindBooksParams) {
    const where = this.buildWhere(params);
    
    const [items, total] = await this.prisma.$transaction([
      this.prisma.book.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: { creatAt: 'desc' }, 
        include: { category: true },
      }),
      this.prisma.book.count({ where }),
    ]);

    return { items, total };
  }

  findById(id: string) {
    return this.prisma.book.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  findByIsbn(isbn: string) {
    return this.prisma.book.findUnique({
      where: { isbn },
    });
  }

  create(data: Prisma.BookUncheckedCreateInput) {
    return this.prisma.book.create({
      data,
      include: { category: true },
    });
  }

  update(id: string, data: Prisma.BookUncheckedUpdateInput) {
    return this.prisma.book.update({
      where: { id },
      data,
      include: { category: true },
    });
  }

  delete(id: string) {
    return this.prisma.book.delete({
      where: { id },
    });
  }
}
