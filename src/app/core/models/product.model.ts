import { Category } from "./category.model";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: number;
  featured?: boolean;
  createdAt?: Date;
  isActive?: boolean;
  stockQuantity?: number;
  category?: Category;
  sku?: string;
}
