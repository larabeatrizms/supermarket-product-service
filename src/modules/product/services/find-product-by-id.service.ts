import { BadRequestException, Inject, Logger } from '@nestjs/common';
import { FindProductByIdDto } from '../dtos/find-product-by-id.dto';
import { Product } from '../entities/product.entity';
import { ProductRepositoryInterface } from '../repositories/product/product.interface.repository';

export class FindProductByIdService {
  private readonly logger = new Logger(FindProductByIdService.name);

  constructor(
    @Inject('ProductRepositoryInterface')
    private readonly productRepository: ProductRepositoryInterface,
  ) {}

  async execute(
    findProductByIdDto: FindProductByIdDto,
  ): Promise<Product | Error> {
    this.logger.log(`Searching product... id: ${findProductByIdDto.id}`);

    const product = await this.productRepository.findOneWithRelations({
      where: {
        id: findProductByIdDto.id,
      },
      relations: {
        category: true,
        pricingHistory: findProductByIdDto.show_pricing_history,
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
