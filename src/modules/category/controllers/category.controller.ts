import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { DeleteCategoryDto } from '../dtos/delete-category.dto';
import { UpdateCategoryDto } from '../dtos/update-category.dto';
import { CreateCategoryService } from '../services/create-category.service';
import { DeleteCategoryService } from '../services/delete-category.service';
import { UpdateCategoryService } from '../services/update-category.service';

@Controller()
export class CategoryController {
  constructor(
    private readonly createCategoryService: CreateCategoryService,
    private readonly updateCategoryService: UpdateCategoryService,
    private readonly deleteCategoryService: DeleteCategoryService,
  ) {}

  @MessagePattern({ role: 'category', cmd: 'create-category' })
  create(data: CreateCategoryDto) {
    return this.createCategoryService.execute(data);
  }

  @MessagePattern({ role: 'category', cmd: 'update-category' })
  update(data: UpdateCategoryDto) {
    return this.updateCategoryService.execute(data);
  }

  @MessagePattern({ role: 'category', cmd: 'delete-category' })
  deleteProduct(data: DeleteCategoryDto) {
    return this.deleteCategoryService.execute(data.id);
  }
}
