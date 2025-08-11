// product.service.ts
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';
import { PaginatedResponse } from '../models/paginated-response.model';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly API_URL = 'http://localhost:3000/';
  private adminBaseUrl = 'http://localhost:3000/admin/products';

  constructor(private http: HttpClient) {}

  getAdminProducts(
    page: number = 1,
    limit: number = 10,
    search: string = ''
  ): Observable<PaginatedResponse<Product>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<PaginatedResponse<Product>>(this.adminBaseUrl, {
      params,
    });
  }

  deleteProduct(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.adminBaseUrl}/${productId}`);
  }

  createProduct(productData: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(this.adminBaseUrl, productData);
  }

  updateProduct(
    productId: number,
    productData: Partial<Product>
  ): Observable<Product> {
    return this.http.put<Product>(
      `${this.adminBaseUrl}/${productId}`,
      productData
    );
  }

  getProductById(productId: number): Observable<Product> {
    return this.http.get<Product>(`${this.adminBaseUrl}/${productId}`);
  }

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
