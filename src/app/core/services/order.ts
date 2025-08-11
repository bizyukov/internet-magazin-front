import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order, OrderStatus } from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:3000/orders';

  constructor(private http: HttpClient) {}

  getOrders(userId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}`, { params: { userId } });
  }

  getOrderDetails(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${orderId}`);
  }

  createOrder(orderData: Partial<Order>): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}`, orderData);
  }

  repeatOrder(orderId: string): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/${orderId}/repeat`, {});
  }

  cancelOrder(orderId: string): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${orderId}/cancel`, {});
  }

  updateOrderStatus(orderId: string, status: OrderStatus): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${orderId}/status`, {
      status,
    });
  }
}
