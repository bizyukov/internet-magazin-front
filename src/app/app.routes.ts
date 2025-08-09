import { Routes } from '@angular/router';
import { Home } from './public/home/home';
import { AUTH_ROUTES } from './auth/auth.routes';

export const routes: Routes = [
    ...AUTH_ROUTES,
    { path: '', component: Home, pathMatch: 'full' },
  /* { path: '', component: HomeComponent },
  { path: 'search', component: SearchResultsComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'auth', loadChildren: () => AuthModule },
  { path: 'user', loadChildren: () => UserModule },
  { path: 'admin', loadChildren: () => AdminModule }, */
];
