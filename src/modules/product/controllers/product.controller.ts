import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { CreateProductInterface } from '../dtos/create-product.interface';
import { FindProductByIdDto } from '../dtos/find-product-by-id.interface';
import { IUpdateProduct } from '../dtos/update-product.interface';
import { CreateProductService } from '../services/create-product.service';
import { FindProductByIdService } from '../services/find-product-by-id.service';
import { UpdateProductService } from '../services/update-product.service';
@Controller()
export class ProductController {
  constructor(
    private readonly createProductService: CreateProductService,
    private readonly updateProductService: UpdateProductService,
    private readonly findProductByIdService: FindProductByIdService,
  ) {}

  @MessagePattern({ role: 'product', cmd: 'create-product' })
  create(data: CreateProductInterface) {
    return this.createProductService.execute(data);
  }

  @MessagePattern({ role: 'product', cmd: 'update-product' })
  update(data: IUpdateProduct) {
    return this.updateProductService.execute(data);
  }

  @MessagePattern({ role: 'product', cmd: 'find-product-by-id' })
  findProductById(data: FindProductByIdDto) {
    return this.findProductByIdService.execute(data.id);
  }
}
