import { Routes } from '@angular/router';
import { ADMIN_ROUTES } from './admin/admin.routes';
import { AUTH_ROUTES } from './auth/auth.routes';
import { Home } from './public/home/home';
import { ProductDetail } from './public/product-detail/product-detail';
import { SearchResults } from './public/search-results/search-results';
import { USER_ROUTES } from './user/user.routes';

export const routes: Routes = [
  ...AUTH_ROUTES,
  ...USER_ROUTES,
  ...ADMIN_ROUTES,
  {
    path: 'product/:id',
    component: ProductDetail,
    title: 'Детали товара',
  },
  {
    path: 'search',
    component: SearchResults,
    title: 'Результаты поиска',
  },
  { path: '', component: Home, pathMatch: 'full' },
];
