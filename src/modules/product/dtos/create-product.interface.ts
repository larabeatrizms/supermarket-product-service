export interface CreateProductInterface {
  id: number;
  name: string;
  sku: string;
  description: string;
  price: number;
  category_id: number;
  file: Express.Multer.File;
}
