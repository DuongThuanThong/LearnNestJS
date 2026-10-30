import { Module } from '@nestjs/common';
import { BooksService } from './books.service.js';
import { BooksController } from './books.controller.js';
import { BooksRepository } from './book.repository.js';

@Module({
  controllers: [BooksController],
  providers: [BooksService, BooksRepository],
})
export class BooksModule {}
