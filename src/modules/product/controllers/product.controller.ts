import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreateProductInterface } from '../dtos/create-product.interface';
import { IUpdateProduct } from '../dtos/update-product.interface';
import { CreateProductService } from '../services/create-product.service';
import { UpdateProductService } from '../services/update-product.service';
@Controller()
export class ProductController {
  constructor(
    private readonly createProductService: CreateProductService,
    private readonly updateProductService: UpdateProductService,
  ) {}

  @MessagePattern({ role: 'product', cmd: 'create-product' })
  create(data: CreateProductInterface) {
    return this.createProductService.execute(data);
  }

  @MessagePattern({ role: 'product', cmd: 'update-product' })
  update(data: IUpdateProduct) {
    return this.updateProductService.execute(data);
  }
}
