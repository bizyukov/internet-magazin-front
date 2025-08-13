import { Routes } from '@angular/router';
import { AUTH_ROUTES } from './auth/auth.routes';
import { Home } from './public/home/home';
import { USER_ROUTES } from './user/user.routes';
import { ADMIN_ROUTES } from './admin/admin.routes';

export const routes: Routes = [
  ...AUTH_ROUTES,
  ...USER_ROUTES,
  ...ADMIN_ROUTES,
  { path: '', component: Home, pathMatch: 'full' },
];
