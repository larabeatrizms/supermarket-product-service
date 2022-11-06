import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { BadRequestException, Inject, Logger } from '@nestjs/common';

import { ISuccessResponse } from 'src/shared/interfaces/SuccessResponse.interface';
import { FilesAzureService } from 'src/shared/providers/azure-files/files-azure.service';
import { CategoryRepositoryInterface } from '../repositories/category/category.interface.repository';

export class DeleteCategoryService {
  private readonly logger = new Logger(DeleteCategoryService.name);

  constructor(
    @Inject('CategoryRepositoryInterface')
    private readonly categoryRepository: CategoryRepositoryInterface,
    private readonly fileService: FilesAzureService,
  ) {}

  async execute(id: number): Promise<ISuccessResponse | Error> {
    this.logger.log(`Searching category... id: ${id}`);

    const category = await this.categoryRepository.findOneById(id);

    if (!category) {
      this.logger.log('Category not found.');

      return new BadRequestException('Categoria não encontrada!');
    }

    const fileToRemove = category.image.split('/').pop();

    await this.fileService.deleteFile(fileToRemove);

    await this.categoryRepository.remove(id);

    this.logger.log('Category deleted.');

    return {
      success: true,
      message: 'Categoria deletada!',
    };
  }
}
