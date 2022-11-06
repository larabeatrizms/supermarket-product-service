import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { BadRequestException, Inject, Logger } from '@nestjs/common';
import { ISuccessResponse } from 'src/shared/interfaces/SuccessResponse.interface';
import { FilesAzureService } from 'src/shared/providers/azure-files/files-azure.service';
import { ProductRepositoryInterface } from '../repositories/product/product.interface.repository';

export class DeleteProductService {
  private readonly logger = new Logger(DeleteProductService.name);

  constructor(
    @Inject('ProductRepositoryInterface')
    private readonly productRepository: ProductRepositoryInterface,
    private readonly fileService: FilesAzureService,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  async execute(id: number): Promise<ISuccessResponse | Error> {
    this.logger.log(`Searching product... id: ${id}`);

    const product = await this.productRepository.findOneById(id);

    if (!product) {
      this.logger.log('Product not found.');

      return new BadRequestException('Produto não encontrado!');
    }

    const fileToRemove = product.image.split('/').pop();

    await this.fileService.deleteFile(fileToRemove);

    await this.productRepository.remove(id);

    this.logger.log('Product deleted.');

    this.amqpConnection.publish('event.exchange', 'event.delete.product.#', {
      id,
    });

    this.logger.log(
      `Product deleted sended to RabbitMQ! routingKey: event.delete.product.#`,
    );

    return {
      success: true,
      message: 'Produto deletado!',
    };
  }
}
