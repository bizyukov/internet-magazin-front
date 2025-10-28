import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = 'http://localhost:3000/admin';

  constructor(private http: HttpClient) {}

  getDashboardStats() {
    return this.http.get(`${this.apiUrl}/dashboard/stats`);
  }

  getRecentOrders(limit: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders/recent`, {
      params: { limit },
    });
  }

  getTopProducts(limit: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products/top`, {
      params: { limit },
    });
  }
}
