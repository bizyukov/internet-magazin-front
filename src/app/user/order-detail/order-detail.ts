import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { OrderService } from '../../core/services/order';

@Component({
  selector: 'app-order-detail',
  imports: [CommonModule],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.scss',
})
export class OrderDetail {
  private route = inject(ActivatedRoute);
  order$ = this.route.paramMap.pipe(
    map((params) => params.get('id')),
    switchMap((orderId) => this.orderService.getOrderDetails(orderId!))
  );

  constructor(private orderService: OrderService) {}

  getStatusText(status: string): string {
    const statuses: Record<string, string> = {
      processing: 'В обработке',
      shipped: 'Отправлен',
      delivered: 'Доставлен',
      cancelled: 'Отменен',
    };
    return statuses[status] || status;
  }
}
