import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductController } from './controllers/product.controller';

import { CreateProductService } from './services/create-product.service';

import { ProductRepository } from './repositories/product/product.repository';

import { Product } from './entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  providers: [
    CreateProductService,
    {
      provide: 'ProductRepositoryInterface',
      useClass: ProductRepository,
    },
  ],
  controllers: [ProductController],
  exports: [],
})
export class ProductModule {}
