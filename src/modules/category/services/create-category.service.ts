import { Inject, Logger } from '@nestjs/common';

import { CreateCategoryInterface } from '../dtos/create-category.interface';
import { RpcException } from '@nestjs/microservices';
import { ISuccessResponse } from 'src/shared/interfaces/SuccessResponse.interface';
import { CategoryRepositoryInterface } from '../repositories/category/category.interface.repository';
import { FilesAzureService } from 'src/shared/providers/azure-files/files-azure.service';

export class CreateCategoryService {
  private readonly logger = new Logger(CreateCategoryService.name);

  constructor(
    @Inject('CategoryRepositoryInterface')
    private readonly categoryRepository: CategoryRepositoryInterface,
    private readonly fileService: FilesAzureService,
  ) {}

  async execute(
    data: CreateCategoryInterface,
  ): Promise<ISuccessResponse | Error> {
    try {
      this.logger.log('Creating a category...');

      this.logger.log('Validating fields...');

      const { name, description, image } = data;

      const categoryAlreadyCreated =
        await this.categoryRepository.findOneByCondition({
          name,
        });

      if (categoryAlreadyCreated) {
        throw new RpcException(
          `Categoria com este "nome": ${name} já está cadastrada.`,
        );
      }

      const buffer = Buffer.from(image.buffer);

      const uploadUrl = await this.fileService.uploadFile({
        ...image,
        buffer,
      });

      const category = await this.categoryRepository.create({
        name,
        description,
        image: uploadUrl,
      });

      this.logger.log(`Category created! Name: ${name}`);

      return {
        success: true,
        message: 'Categoria Criada!',
        details: {
          category_id: category.id,
        },
      };
    } catch (error) {
      this.logger.error(error, error.stack);
      throw new RpcException(error?.message || error);
    }
  }
}
