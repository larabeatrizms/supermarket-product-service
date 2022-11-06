import { Inject, Logger } from '@nestjs/common';

import { RpcException } from '@nestjs/microservices';
import { ISuccessResponse } from 'src/shared/interfaces/SuccessResponse.interface';
import { FilesAzureService } from 'src/shared/providers/azure-files/files-azure.service';
import { UpdateCategoryDto } from '../dtos/update-category.dto';
import { CategoryRepositoryInterface } from '../repositories/category/category.interface.repository';

export class UpdateCategoryService {
  private readonly logger = new Logger(UpdateCategoryService.name);

  constructor(
    @Inject('CategoryRepositoryInterface')
    private readonly categoryRepository: CategoryRepositoryInterface,
    private readonly fileService: FilesAzureService,
  ) {}

  async execute(data: UpdateCategoryDto): Promise<ISuccessResponse | Error> {
    try {
      this.logger.log('Updating a category...');

      this.logger.log('Validating fields...');

      const { id, name, description, image } = data;

      const category = await this.categoryRepository.findOneById(id);

      if (!category) {
        throw new RpcException('Categoria não encontrada!');
      }

      // Caso atualize "name", verifica se já existe categoria com o mesmo "name"
      if (name !== category.name) {
        const categoryAlreadyCreated =
          await this.categoryRepository.findOneByCondition({
            name,
          });

        if (categoryAlreadyCreated) {
          throw new RpcException(`Este nome "${name}" já está cadastrado.`);
        }
      }

      // Caso atualize imagem, deleta imagem e armazena nova
      if (image) {
        const fileToRemove = category.image.split('/').pop();

        await this.fileService.deleteFile(fileToRemove);

        const buffer = Buffer.from(image.buffer);

        const uploadFileUrl = await this.fileService.uploadFile({
          ...image,
          buffer,
        });

        category.image = uploadFileUrl;
      }

      category.name = name;
      category.description = description;

      await this.categoryRepository.update(category);

      this.logger.log(`Category updated! Name: ${name}`);

      return {
        success: true,
        message: 'Categoria atualizada!',
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
