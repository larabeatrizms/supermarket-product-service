export interface CreateProductInterface {
  id: number;
  name: string;
  sku: string;
  description: string;
  price: number;
  file: Express.Multer.File;
}
