import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../../auth/services/auth';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-header',
  imports: [AsyncPipe, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  searchQuery = '';
  isLoggedIn = false; // Заглушка, в реальном приложении через AuthService
  cartCount = 0;
  wishlistCount = 0;

  constructor(private cartService: CartService, public authService: Auth) {
    this.cartService.cart$.subscribe((cart) => {
      this.cartCount = cart.items.length;
    });
  }

  search() {
    if (this.searchQuery.trim()) {
      // В реальном приложении: this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
      console.log('Search query:', this.searchQuery);
    }
  }

  logout() {
    // Заглушка для выхода
    this.isLoggedIn = false;
  }
}
