import { Injectable } from '@nestjs/common';
import { isConstructor } from '@nestjs/common/internal';
import { PrismaService } from '../../database/prisma.service.js';

@Injectable()
export class CategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.category.findMany({ orderBy: { name: 'asc' } });
  }

  findById(id: string) {
    return this.prisma.category.findUnique({ where: { id } });
  }

  create(name: string) {
    return this.prisma.category.create({ data: { name } });
  }
}
