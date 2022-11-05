import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { BadRequestException, Inject, Logger } from '@nestjs/common';
import { ISuccessResponse } from 'src/shared/interfaces/SuccessResponse.interface';
import { ProductRepositoryInterface } from '../repositories/product/product.interface.repository';

export class DeleteProductService {
  private readonly logger = new Logger(DeleteProductService.name);

  constructor(
    @Inject('ProductRepositoryInterface')
    private readonly productRepository: ProductRepositoryInterface,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  async execute(id: number): Promise<ISuccessResponse | Error> {
    this.logger.log(`Searching product... id: ${id}`);

    const product = await this.productRepository.remove(id);

    if (!product) {
      this.logger.log('Product not found.');

      return new BadRequestException('Produto não encontrado!');
    }

    this.logger.log('Product deleted.');

    this.amqpConnection.publish(
      'event.exchange',
      'event.delete.product.#',
      product,
    );

    this.logger.log(
      `Product deleted sended to RabbitMQ! routingKey: event.delete.product.#`,
    );

    return {
      success: true,
      message: 'Produto deletado!',
    };
  }
}
