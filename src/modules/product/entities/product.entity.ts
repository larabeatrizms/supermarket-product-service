import { Category } from 'src/modules/category/entities/category.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProductPricingHistory } from './product-pricing-history.entity';

@Entity()
@Unique(['sku'])
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  sku: string;

  @Column()
  description: string;

  @Column()
  image: string;

  @Column({
    type: 'float',
  })
  price: number;

  @Column({ nullable: true })
  category_id?: number;

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'category_id' })
  category?: Category;

  @OneToMany(
    () => ProductPricingHistory,
    (productPricingHistory) => productPricingHistory.product,
  )
  pricingHistory: ProductPricingHistory[];

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @Column()
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;
}
