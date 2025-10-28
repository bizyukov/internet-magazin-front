import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../core/services/admin';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  stats: any = {};
  recentOrders: any[] = [];
  topProducts: any[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.adminService.getDashboardStats().subscribe((stats) => {
      this.stats = stats;
    });

    this.adminService.getRecentOrders(5).subscribe((orders) => {
      this.recentOrders = orders;
    });

    this.adminService.getTopProducts(5).subscribe((products) => {
      this.topProducts = products;
    });
  }
}
