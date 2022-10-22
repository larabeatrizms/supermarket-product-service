import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseAbstractRepository } from 'src/repositories/base/base.abstract.repository';
import { ProductRepositoryInterface } from './product.interface.repository';
import { Product } from '../../entities/product.entity';

@Injectable()
export class ProductRepository
  extends BaseAbstractRepository<Product>
  implements ProductRepositoryInterface
{
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {
    super(productsRepository);
  }
}
