import { BaseInterfaceRepository } from '../../../../repositories/base/base.interface.repository';
import { Product } from '../../entities/product.entity';

export type ProductRepositoryInterface = BaseInterfaceRepository<Product>;
