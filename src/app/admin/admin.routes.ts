// admin.routes.ts
import { Routes } from '@angular/router';
import { AdminAuthGuard } from '../core/guards/admin-auth.guard';
import { AdminLayoutComponent } from './layout/admin-layout.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AdminAuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard.component').then(
            (c) => c.DashboardComponent
          ),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./products/products.component').then(
            (c) => c.ProductsComponent
          ),
      },
      {
        path: 'products/create',
        loadComponent: () =>
          import('./product-form/product-form.component').then(
            (c) => c.ProductFormComponent
          ),
      },
      {
        path: 'products/edit/:id',
        loadComponent: () =>
          import('./product-form/product-form.component').then(
            (c) => c.ProductFormComponent
          ),
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./categories/categories.component').then(
            (c) => c.CategoriesComponent
          ),
      },
      {
        path: 'manufacturers',
        loadComponent: () =>
          import('./manufacturers/manufacturers.component').then(
            (c) => c.ManufacturersComponent
          ),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./orders/orders.component').then((c) => c.OrdersComponent),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./users/users.component').then((c) => c.UsersComponent),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
