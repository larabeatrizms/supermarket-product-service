import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { CreateProductDto } from '../dtos/create-product.dto';
import { DeleteProductDto } from '../dtos/delete-product.dto';
import { FindProductByIdDto } from '../dtos/find-product-by-id.dto';
import { FindProductsByFieldsDto } from '../dtos/find-products-by-fields.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { CreateProductService } from '../services/create-product.service';
import { DeleteProductService } from '../services/delete-product.service';
import { FindProductByIdService } from '../services/find-product-by-id.service';
import { FindProductsByFieldsService } from '../services/find-products-by-fields.service';
import { UpdateProductService } from '../services/update-product.service';
@Controller()
export class ProductController {
  constructor(
    private readonly createProductService: CreateProductService,
    private readonly updateProductService: UpdateProductService,
    private readonly findProductByIdService: FindProductByIdService,
    private readonly findProductsByFieldsService: FindProductsByFieldsService,
    private readonly deleteProductService: DeleteProductService,
  ) {}

  @MessagePattern({ role: 'product', cmd: 'create-product' })
  create(data: CreateProductDto) {
    return this.createProductService.execute(data);
  }

  @MessagePattern({ role: 'product', cmd: 'update-product' })
  update(data: UpdateProductDto) {
    return this.updateProductService.execute(data);
  }

  @MessagePattern({ role: 'product', cmd: 'find-product-by-id' })
  findProductById(data: FindProductByIdDto) {
    return this.findProductByIdService.execute(data.id);
  }

  @MessagePattern({ role: 'product', cmd: 'find-products-by-fields' })
  findProductsByFields(data: FindProductsByFieldsDto) {
    return this.findProductsByFieldsService.execute(data);
  }

  @MessagePattern({ role: 'product', cmd: 'delete-product' })
  deleteProduct(data: DeleteProductDto) {
    return this.deleteProductService.execute(data.id);
  }
}
