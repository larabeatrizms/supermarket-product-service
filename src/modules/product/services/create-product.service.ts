import { Inject, Logger } from '@nestjs/common';

import { CreateProductInterface } from '../dtos/create-product.interface';
import { RpcException } from '@nestjs/microservices';
import { ISuccessResponse } from 'src/shared/interfaces/SuccessResponse.interface';
import { ProductRepositoryInterface } from '../repositories/product/product.interface.repository';
import { FilesAzureService } from 'src/shared/providers/azure-files/files-azure.service';
import { ProductPricingHistoryRepositoryInterface } from '../repositories/product-pricing-history/product-pricing-history.interface.repository';
import { CategoryRepositoryInterface } from 'src/modules/category/repositories/category/category.interface.repository';

export class CreateProductService {
  private readonly logger = new Logger(CreateProductService.name);

  constructor(
    @Inject('ProductRepositoryInterface')
    private readonly productRepository: ProductRepositoryInterface,
    @Inject('ProductPricingHistoryRepositoryInterface')
    private readonly productPricingHistoryRepository: ProductPricingHistoryRepositoryInterface,
    @Inject('CategoryRepositoryInterface')
    private readonly categoryRepository: CategoryRepositoryInterface,
    private readonly fileService: FilesAzureService,
  ) {}

  async execute(
    data: CreateProductInterface,
  ): Promise<ISuccessResponse | Error> {
    try {
      this.logger.log('Creating a product...');

      this.logger.log('Validating fields...');

      const productAlreadyCreated =
        await this.productRepository.findOneByCondition({
          sku: data.sku,
        });

      if (productAlreadyCreated) {
        throw new RpcException('Produto com este sku já está cadastrado.');
      }

      const category = await this.categoryRepository.findOneById(
        data.category_id,
      );

      if (!category) {
        throw new RpcException('Categoria não encontrada!');
      }

      const buffer = Buffer.from(data.file.buffer);

      const uploadUrl = await this.fileService.uploadFile({
        ...data.file,
        buffer,
      });

      const product = await this.productRepository.create({
        name: data.name,
        description: data.description,
        sku: data.sku,
        image: uploadUrl,
        price: data.price,
        category_id: data.category_id,
      });

      await this.productPricingHistoryRepository.create({
        product_id: product.id,
        price: Number(data.price),
      });

      this.logger.log(`Product created! Name: ${data.name}`);

      return {
        success: true,
        message: 'Produto Criado!',
        details: {
          product_id: product.id,
        },
      };
    } catch (error) {
      this.logger.error(error, error.stack);
      throw new RpcException(error?.message || error);
    }
  }
}
