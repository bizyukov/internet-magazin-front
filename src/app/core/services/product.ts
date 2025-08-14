// product.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../models/paginated-response.model';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly API_URL = 'http://localhost:3000/products/';

  constructor(private http: HttpClient) {}

  getFeaturedProducts(limit: number): Observable<PaginatedResponse<Product>> {
    return this.http.get<PaginatedResponse<Product>>(this.API_URL, {
      params: {
        featured: 'true',
        _limit: limit.toString(),
      },
    });
  }

  getNewArrivals(limit: number): Observable<PaginatedResponse<Product>> {
    return this.http.get<PaginatedResponse<Product>>(this.API_URL, {
      params: {
        sort: 'createdAt:DESC',
        _limit: limit.toString(),
      },
    });
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.API_URL}${id}`);
  }

  getRelatedProducts(
    categoryId: number,
    excludeId: number,
    limit: number = 4
  ): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.API_URL}related`, {
      params: {
        categoryId: categoryId.toString(),
        excludeId: excludeId.toString(),
        limit: limit.toString(),
      },
    });
  }
}
