import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../models/paginated-response.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class AdminProductService {
  private readonly API_URL = 'http://localhost:3000/admin/products/';

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

    return this.http.get<PaginatedResponse<Product>>(this.API_URL, {
      params,
    });
  }

  deleteProduct(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}${productId}`);
  }

  createProduct(productData: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(this.API_URL, productData);
  }

  updateProduct(
    productId: number,
    productData: Partial<Product>
  ): Observable<Product> {
    return this.http.put<Product>(`${this.API_URL}${productId}`, productData);
  }

  getProductById(productId: number): Observable<Product> {
    return this.http.get<Product>(`${this.API_URL}${productId}`);
  }
}
