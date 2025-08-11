import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../../core/services/order';
import { getOrderStatusText } from '../../core/models/order.model';

@Component({
  selector: 'app-orders',
  imports: [AsyncPipe, CommonModule],
  templateUrl: './orders.html',
  styleUrl: './orders.scss',
})
export class Orders {
  private orderService = inject(OrderService);
  orders$ = this.orderService.getOrders('');
  getOrderStatusText = getOrderStatusText;

  constructor(private router: Router) {}

  getStatusBadge(status: string): string {
    switch (status) {
      case 'completed':
        return 'success';
      case 'processing':
        return 'primary';
      case 'shipped':
        return 'info';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  viewOrderDetails(orderId: string) {
    this.router.navigate(['/user/orders', orderId]);
  }

  repeatOrder(orderId: string) {
    this.orderService.repeatOrder(orderId).subscribe(() => {
      this.router.navigate(['/user/cart']);
    });
  }
}
