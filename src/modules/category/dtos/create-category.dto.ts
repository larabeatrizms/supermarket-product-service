export interface CreateCategoryDto {
  name: string;
  description: string;
  image: Express.Multer.File;
}
