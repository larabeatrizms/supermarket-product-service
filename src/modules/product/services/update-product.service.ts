import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Inject, Logger } from '@nestjs/common';

import { RpcException } from '@nestjs/microservices';
import { CategoryRepositoryInterface } from 'src/modules/category/repositories/category/category.interface.repository';
import { ISuccessResponse } from 'src/shared/interfaces/SuccessResponse.interface';
import { FilesAzureService } from 'src/shared/providers/azure-files/files-azure.service';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { ProductPricingHistoryRepositoryInterface } from '../repositories/product-pricing-history/product-pricing-history.interface.repository';
import { ProductRepositoryInterface } from '../repositories/product/product.interface.repository';

export class UpdateProductService {
  private readonly logger = new Logger(UpdateProductService.name);

  constructor(
    @Inject('ProductRepositoryInterface')
    private readonly productRepository: ProductRepositoryInterface,
    @Inject('ProductPricingHistoryRepositoryInterface')
    private readonly productPricingHistoryRepository: ProductPricingHistoryRepositoryInterface,
    @Inject('CategoryRepositoryInterface')
    private readonly categoryRepository: CategoryRepositoryInterface,
    private readonly fileService: FilesAzureService,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  async execute(data: UpdateProductDto): Promise<ISuccessResponse | Error> {
    try {
      this.logger.log('Updating a product...');

      this.logger.log('Validating fields...');

      const { id, sku, name, description, price, file, category_id } = data;

      const product = await this.productRepository.findOneById(id);

      if (!product) {
        throw new RpcException('Produto não encontrado!');
      }

      const category = await this.categoryRepository.findOneById(
        data.category_id,
      );

      if (!category) {
        throw new RpcException('Categoria não encontrada!');
      }

      // Caso atualize "sku", verifica se já existe produto com o mesmo "sku"
      if (sku !== product.sku) {
        const productAlreadyCreated =
          await this.productRepository.findOneByCondition({
            sku,
          });

        if (productAlreadyCreated) {
          throw new RpcException(`Este "sku": ${sku} já está cadastrado.`);
        }
      }

      // Caso atualize imagem, deleta imagem e armazena nova
      if (file) {
        const fileToRemove = product.image.split('/').pop();

        await this.fileService.deleteFile(fileToRemove);

        const buffer = Buffer.from(file.buffer);

        const uploadFileUrl = await this.fileService.uploadFile({
          ...file,
          buffer,
        });

        product.image = uploadFileUrl;
      }

      // Atualização de preço, armazena no hitórico de preços
      if (Number(price) !== product.price) {
        const oldPricHistory =
          await this.productPricingHistoryRepository.findOneByCondition(
            {
              product_id: product.id,
            },
            {
              startedAt: 'DESC',
            },
          );

        oldPricHistory.endedAt = new Date();

        await this.productPricingHistoryRepository.update(oldPricHistory);

        await this.productPricingHistoryRepository.create({
          product_id: product.id,
          price: Number(price),
        });
      }

      product.name = name;
      product.description = description;
      product.price = Number(price);
      product.sku = sku;
      product.category_id = category_id;

      await this.productRepository.update(product);

      this.logger.log(`Product updated! Name: ${name} - Price: ${price}`);

      this.amqpConnection.publish(
        'event.exchange',
        'event.update.product.#',
        product,
      );

      this.logger.log(
        `Product updated sended to RabbitMQ! routingKey: event.update.product.#`,
      );

      return {
        success: true,
        message: 'Produto atualizado!',
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
