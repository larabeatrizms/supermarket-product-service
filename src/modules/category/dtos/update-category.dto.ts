export interface UpdateCategoryDto {
  id: number;
  name: string;
  description: string;
  image: Express.Multer.File;
}
