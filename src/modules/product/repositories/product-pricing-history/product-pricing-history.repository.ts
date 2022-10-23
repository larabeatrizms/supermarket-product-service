import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseAbstractRepository } from 'src/repositories/base/base.abstract.repository';
import { ProductPricingHistoryRepositoryInterface } from './product-pricing-history.interface.repository';
import { ProductPricingHistory } from '../../entities/product-pricing-history.entity';

@Injectable()
export class ProductPricingHistoryRepository
  extends BaseAbstractRepository<ProductPricingHistory>
  implements ProductPricingHistoryRepositoryInterface
{
  constructor(
    @InjectRepository(ProductPricingHistory)
    private readonly productPricingHistoriesRepository: Repository<ProductPricingHistory>,
  ) {
    super(productPricingHistoriesRepository);
  }
}
