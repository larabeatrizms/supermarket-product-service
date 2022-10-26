import { BadRequestException, Inject, Logger } from '@nestjs/common';
import { ILike } from 'typeorm';
import { FindProductsByFieldsDto } from '../dtos/find-products-by-fields.dto';
import { Product } from '../entities/product.entity';
import { ProductRepositoryInterface } from '../repositories/product/product.interface.repository';

export class FindProductsByFieldsService {
  private readonly logger = new Logger(FindProductsByFieldsService.name);

  constructor(
    @Inject('ProductRepositoryInterface')
    private readonly productRepository: ProductRepositoryInterface,
  ) {}

  async execute(data: FindProductsByFieldsDto): Promise<Product[] | Error> {
    this.logger.log(`Searching products...`);

    const { name, category_id } = data;

    const whereQuery = {
      name: ILike(`%${name}%`),
      category_id,
    };

    if (!name) {
      delete whereQuery.name;
    }

    const products = await this.productRepository.findWithRelations({
      where: whereQuery,
      relations: {
        category: true,
      },
    });

    if (!products || !products.length) {
      this.logger.log('Products not found.');

      return new BadRequestException('Produtos não encontrados!');
    }

    this.logger.log('Products found.');

    return products;
  }
}
