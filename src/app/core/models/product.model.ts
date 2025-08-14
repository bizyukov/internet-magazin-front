import { Category } from './category.model';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: number;
  featured?: boolean;
  isActive?: boolean;
  stockQuantity?: number;
  category?: Category;
  sku?: string;
  oldPrice?: number;
  images?: string[]; // Массив URL изображений
  rating: number;
  reviewCount: number;
  specifications: {
    key: string;
    value: string;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}
