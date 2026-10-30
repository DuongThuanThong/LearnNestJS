import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { CategoriesRepository } from './categories.repository.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  findAll() {
    return this.categoriesRepository.findAll();
  }

  async findOne(id: string) {
    const category = await this.categoriesRepository.findById(id);
    if (!category) throw new NotFoundException(`Category ${id} not found`);
    return category;
  }

  create(dto: CreateCategoryDto) {
    return this.categoriesRepository.create(dto.name);
  }
}
