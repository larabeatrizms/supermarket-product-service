import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductController } from './controllers/product.controller';

import { CreateProductService } from './services/create-product.service';
import { UpdateProductService } from './services/update-product.service';

import { ProductRepository } from './repositories/product/product.repository';
import { ProductPricingHistoryRepository } from './repositories/product-pricing-history/product-pricing-history.repository';

import { Product } from './entities/product.entity';
import { ProductPricingHistory } from './entities/product-pricing-history.entity';

import { FilesAzureService } from 'src/shared/providers/azure-files/files-azure.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductPricingHistory])],
  providers: [
    CreateProductService,
    UpdateProductService,
    {
      provide: 'ProductRepositoryInterface',
      useClass: ProductRepository,
    },
    {
      provide: 'ProductPricingHistoryRepositoryInterface',
      useClass: ProductPricingHistoryRepository,
    },
    FilesAzureService,
  ],
  controllers: [ProductController],
  exports: [],
})
export class ProductModule {}
