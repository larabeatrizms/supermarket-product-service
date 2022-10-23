import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryController } from './controllers/category.controller';

import { CreateCategoryService } from './services/create-category.service';

import { CategoryRepository } from './repositories/category/category.repository';

import { Category } from './entities/category.entity';

import { FilesAzureService } from 'src/shared/providers/azure-files/files-azure.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [
    CreateCategoryService,
    {
      provide: 'CategoryRepositoryInterface',
      useClass: CategoryRepository,
    },
    FilesAzureService,
  ],
  controllers: [CategoryController],
  exports: [],
})
export class CategoryModule {}