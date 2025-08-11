import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Auth } from '../../../auth/services/auth';
import { CartService } from '../../../core/services/cart';
import { WishlistService } from '../../../core/services/wishlist';

@Component({
  selector: 'app-user-layout',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './user-layout.html',
  styleUrl: './user-layout.scss',
})
export class UserLayout {
  cartCount = 0;
  wishlistCount = 0;

  constructor(
    private authService: Auth,
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {
    this.cartService.cart$.subscribe((cart) => {
      this.cartCount = cart.items.length;
    });

    this.wishlistService.wishlist$.subscribe((items) => {
      this.wishlistCount = items.length;
    });
  }

  logout() {
    this.authService.logout();
  }
}
