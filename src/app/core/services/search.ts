import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../models/paginated-response.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private readonly API_URL = 'http://localhost:3000/';

  constructor(private http: HttpClient) {}

  searchProducts(
    query: string,
    page: number = 1,
    pageSize: number = 12,
    filters: any = {}
  ): Observable<PaginatedResponse<Product>> {
    let params = new HttpParams()
      .set('q', query)
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    // Добавляем фильтры
    for (const key in filters) {
      if (filters[key]) {
        params = params.set(key, filters[key]);
      }
    }

    return this.http.get<PaginatedResponse<Product>>(`${this.API_URL}products`, { params });
  }

  getSearchSuggestions(query: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}suggestions`, {
      params: { q: query },
    });
  }
}
