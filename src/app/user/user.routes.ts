import { Routes } from '@angular/router';
import { AuthGuard } from '../core/guards/auth-guard';
import { UserLayout } from './layout/user-layout/user-layout';
import { Profile } from './profile/profile';
import { Wishlist } from './wishlist/wishlist';
import { Cart } from './cart/cart';
import { Orders } from './orders/orders';
import { OrderDetail } from './order-detail/order-detail';

export const USER_ROUTES: Routes = [
  {
    path: 'user',
    component: UserLayout,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'profile',
        component: Profile,
      },
      {
        path: 'wishlist',
        component: Wishlist,
      },
      {
        path: 'cart',
        component: Cart,
      },
      {
        path: 'orders',
        component: Orders,
      },
      {
        path: 'orders/:id',
        component: OrderDetail,
      },
      /* {
        path: 'addresses',
        component: Addresses,
      }, */
      /* {
        path: 'payment-methods',
        component: PaymentMethodsComponent,
      }, */
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
    ],
  },
];
