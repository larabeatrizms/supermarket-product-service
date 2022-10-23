import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseAbstractRepository } from 'src/repositories/base/base.abstract.repository';
import { CategoryRepositoryInterface } from './category.interface.repository';
import { Category } from '../../entities/category.entity';

@Injectable()
export class CategoryRepository
  extends BaseAbstractRepository<Category>
  implements CategoryRepositoryInterface
{
  constructor(
    @InjectRepository(Category)
    private readonly productsRepository: Repository<Category>,
  ) {
    super(productsRepository);
  }
}
