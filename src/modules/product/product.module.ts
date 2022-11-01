import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

import { ProductController } from './controllers/product.controller';

import { CreateProductService } from './services/create-product.service';
import { UpdateProductService } from './services/update-product.service';

import { ProductRepository } from './repositories/product/product.repository';
import { ProductPricingHistoryRepository } from './repositories/product-pricing-history/product-pricing-history.repository';

import { Product } from './entities/product.entity';
import { ProductPricingHistory } from './entities/product-pricing-history.entity';

import { FilesAzureService } from 'src/shared/providers/azure-files/files-azure.service';
import { CategoryModule } from '../category/category.module';
import { FindProductByIdService } from './services/find-product-by-id.service';
import { FindProductsByFieldsService } from './services/find-products-by-fields.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductPricingHistory]),
    CategoryModule,
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: `amqp://${configService.get('RABBIT_HOST')}`,
        exchanges: [
          {
            name: 'event.exchange',
            type: 'topic',
          },
        ],
      }),
    }),
  ],
  providers: [
    CreateProductService,
    UpdateProductService,
    FindProductByIdService,
    FindProductsByFieldsService,
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
