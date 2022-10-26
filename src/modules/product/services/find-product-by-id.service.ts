import { BadRequestException, Inject, Logger } from '@nestjs/common';
import { Product } from '../entities/product.entity';
import { ProductRepositoryInterface } from '../repositories/product/product.interface.repository';

export class FindProductByIdService {
  private readonly logger = new Logger(FindProductByIdService.name);

  constructor(
    @Inject('ProductRepositoryInterface')
    private readonly productRepository: ProductRepositoryInterface,
  ) {}

  async execute(id: number): Promise<Product | Error> {
    this.logger.log(`Searching product... id: ${id}`);

    const product = await this.productRepository.findOneWithRelations({
      where: {
        id,
      },
      relations: {
        category: true,
      },
    });

    if (!product) {
      this.logger.log('Product not found.');

      return new BadRequestException('Produto não encontrado!');
    }

    this.logger.log('Product founded.');

    return product;
  }
}
