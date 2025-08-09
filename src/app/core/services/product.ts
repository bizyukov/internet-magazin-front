// product.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly API_URL = 'http://localhost:3000/';

  constructor(private http: HttpClient) {}

  getFeaturedProducts(limit: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.API_URL}/products`, {
      params: {
        featured: 'true',
        _limit: limit.toString(),
      },
    });
  }

  getNewArrivals(limit: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.API_URL}/products`, {
      params: {
        sort: 'createdAt:DESC',
        _limit: limit.toString(),
      },
    });
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.API_URL}/categories`);
  }
}
