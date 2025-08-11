import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  getOrderStatusText,
  Order,
  OrderStatus,
} from '../../core/models/order.model';
import { OrderService } from '../../core/services/order';

@Component({
  selector: 'app-orders',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './orders.html',
  styleUrl: './orders.scss',
})
export class Orders {
  orders: Order[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  isLoading = true;
  statusFilter: OrderStatus | 'all' = 'all';
  searchQuery = '';
  totalPages = 1;
  getOrderStatusText = getOrderStatusText;

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading = true;
    this.orderService
      .getOrders(
        this.currentPage,
        this.itemsPerPage,
        this.statusFilter !== 'all' ? this.statusFilter : undefined,
        this.searchQuery
      )
      .subscribe((response) => {
        this.orders = response.items;
        this.totalItems = response.total;
        this.isLoading = false;
        this.totalPages = response.totalPages;
      });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadOrders();
  }

  onStatusChange(status: string) {
    this.statusFilter = status as OrderStatus | 'all';
    this.currentPage = 1;
    this.loadOrders();
  }

  searchOrders() {
    this.currentPage = 1;
    this.loadOrders();
  }

  getStatusClass(status: OrderStatus): string {
    switch (status) {
      case 'delivered':
        return 'bg-success';
      case 'processing':
        return 'bg-primary';
      case 'shipped':
        return 'bg-info';
      case 'cancelled':
        return 'bg-danger';
      case 'returned':
        return 'bg-warning text-dark';
      default:
        return 'bg-secondary';
    }
  }
}
