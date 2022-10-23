import { BaseInterfaceRepository } from '../../../../repositories/base/base.interface.repository';
import { ProductPricingHistory } from '../../entities/product-pricing-history.entity';

export type ProductPricingHistoryRepositoryInterface =
  BaseInterfaceRepository<ProductPricingHistory>;
