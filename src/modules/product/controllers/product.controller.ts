import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreateProductInterface } from '../dtos/create-product.interface';
import { CreateProductService } from '../services/create-product.service';

@Controller()
export class ProductController {
  constructor(private readonly createProductService: CreateProductService) {}

  @MessagePattern({ role: 'product', cmd: 'create-product' })
  create(data: CreateProductInterface) {
    return this.createProductService.execute(data);
  }
}
