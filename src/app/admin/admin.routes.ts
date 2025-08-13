import { Routes } from '@angular/router';
import { AdminAuthGuard } from '../core/guards/admin-auth-guard';
import { Categories } from './categories/categories';
import { Dashboard } from './dashboard/dashboard';
import { AdminLayout } from './layout/admin-layout/admin-layout';
import { Manufacturers } from './manufacturers/manufacturers';
import { Orders } from './orders/orders';
import { ProductForm } from './product-form/product-form';
import { Products } from './products/products';
import { Users } from './users/users';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [AdminAuthGuard],
    children: [
      {
        path: 'dashboard',
        component: Dashboard,
      },
      {
        path: 'products',
        component: Products,
      },
      {
        path: 'products/create',
        component: ProductForm,
      },
      {
        path: 'products/edit/:id',
        component: ProductForm,
      },
      {
        path: 'categories',
        component: Categories,
      },
      {
        path: 'manufacturers',
        component: Manufacturers,
      },
      {
        path: 'orders',
        component: Orders,
      },
      {
        path: 'users',
        component: Users,
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
