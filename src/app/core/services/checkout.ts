import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Address } from '../models/address.model';
import { Order } from '../models/order.model';
import { PaymentMethod } from '../models/payment-method.model';

@Injectable({ providedIn: 'root' })
export class CheckoutService {
  private readonly API_URL = 'http://localhost:3000/checkout';

  constructor(private http: HttpClient) {}

  createOrder(orderData: any): Observable<Order> {
    return this.http.post<Order>(`${this.API_URL}/orders`, orderData);
  }

  getUserAddresses(): Observable<Address[]> {
    return this.http.get<Address[]>(`${this.API_URL}/addresses`);
  }

  createAddress(address: Address): Observable<Address> {
    return this.http.post<Address>(`${this.API_URL}/addresses`, address);
  }

  getUserPaymentMethods(): Observable<PaymentMethod[]> {
    return this.http.get<PaymentMethod[]>(`${this.API_URL}/payment-methods`);
  }

  createPaymentMethod(paymentMethod: PaymentMethod): Observable<PaymentMethod> {
    return this.http.post<PaymentMethod>(
      `${this.API_URL}/payment-methods`,
      paymentMethod
    );
  }
}
