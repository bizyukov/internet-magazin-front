import { Routes } from '@angular/router';
import { Home } from './public/home/home';

export const routes: Routes = [
    { path: '', component: Home, pathMatch: 'full' },
  /* { path: '', component: HomeComponent },
  { path: 'search', component: SearchResultsComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'auth', loadChildren: () => AuthModule },
  { path: 'user', loadChildren: () => UserModule },
  { path: 'admin', loadChildren: () => AdminModule }, */
];
