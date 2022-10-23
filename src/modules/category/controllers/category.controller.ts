import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreateCategoryInterface } from '../dtos/create-category.interface';
import { CreateCategoryService } from '../services/create-category.service';

@Controller()
export class CategoryController {
  constructor(private readonly createCategoryService: CreateCategoryService) {}

  @MessagePattern({ role: 'category', cmd: 'create-category' })
  create(data: CreateCategoryInterface) {
    return this.createCategoryService.execute(data);
  }
}
