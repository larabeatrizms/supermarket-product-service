import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreateCategoryInterface } from '../dtos/create-category.interface';
import { IUpdateCategory } from '../dtos/update-category.interface';
import { CreateCategoryService } from '../services/create-category.service';
import { UpdateCategoryService } from '../services/update-category.service';

@Controller()
export class CategoryController {
  constructor(
    private readonly createCategoryService: CreateCategoryService,
    private readonly updateCategoryService: UpdateCategoryService,
  ) {}

  @MessagePattern({ role: 'category', cmd: 'create-category' })
  create(data: CreateCategoryInterface) {
    return this.createCategoryService.execute(data);
  }

  @MessagePattern({ role: 'category', cmd: 'update-category' })
  update(data: IUpdateCategory) {
    return this.updateCategoryService.execute(data);
  }
}
