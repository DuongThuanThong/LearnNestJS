import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { BooksRepository } from './book.repository.js';
import { CreateBookDto } from './dto/create-book.dto.js';
import { UpdateBookDto } from './dto/update-book.dto.js';
import { QueryBookDto } from './dto/query-book.dto.js';

@Injectable()
export class BooksService {
  constructor(private readonly booksRepository: BooksRepository) {}

  async create(dto: CreateBookDto) {
    if (await this.booksRepository.findByIsbn(dto.isbn)) {
      throw new ConflictException(`ISBN ${dto.isbn} đã tồn tại`);
    }

    const book = await this.booksRepository.create({
      title: dto.title,
      author: dto.author,
      isbn: dto.isbn,
      price: dto.price,
      publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : null,
      categoryId: dto.categoryId,
    });

    return book;
  }

  async findOne(id: string) {
    const book = await this.booksRepository.findById(id);
    if (!book) throw new NotFoundException(`Book ${id} not found`);
    return book;
  }

  async findAll(query: QueryBookDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const { items, total } = await this.booksRepository.findMany({
      skip: (page - 1) * limit,
      take: limit,
      search: query.search,
      categoryId: query.categoryId,
    });
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async update(id: string, dto: UpdateBookDto) {
    await this.findOne(id);
    const { categoryId, publishedAt, ...rest } = dto;
    return this.booksRepository.update(id, {
      ...rest,
      ...(publishedAt ? { publishedAt: new Date(publishedAt) } : {}),
      ...(categoryId ? { category: { connect: { id: categoryId } } } : {}),
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.booksRepository.delete(id);
  }
}
