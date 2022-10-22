import { Inject, Logger } from '@nestjs/common';

import { CreateProductInterface } from '../dtos/create-product.interface';
import { RpcException } from '@nestjs/microservices';
import { ISuccessResponse } from 'src/shared/interfaces/SuccessResponse.interface';
import { ProductRepositoryInterface } from '../repositories/product/product.interface.repository';

export class CreateProductService {
  private readonly logger = new Logger(CreateProductService.name);

  constructor(
    @Inject('ProductRepositoryInterface')
    private readonly productRepository: ProductRepositoryInterface,
  ) {}

  async execute(
    data: CreateProductInterface,
  ): Promise<ISuccessResponse | Error> {
    try {
      this.logger.log('Creating a product...');

      this.logger.log('Validating fields...');

      // const userAlreadyCreated = await this.userRepository.findOneByCondition({
      //   email: userData.email,
      // });

      // if (userAlreadyCreated) {
      //   throw new RpcException('Este e-mail já está cadastrado.');
      // }

      // const user = await this.userRepository.create(userData);

      // this.logger.log(`User created! Email: ${userData.email}`);

      return {
        success: true,
        message: 'Product created!',
        details: {
          product_id: 'product_id',
        },
      };
    } catch (error) {
      this.logger.error(error, error.stack);
      throw new RpcException(error?.message || error);
    }
  }
}
