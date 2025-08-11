export interface Manufacturer {
  id: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  productCount?: number; // Количество товаров этого производителя
}
