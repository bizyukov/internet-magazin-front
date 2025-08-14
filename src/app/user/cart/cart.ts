import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart {
  private cartService = inject(CartService);
  cart$ = this.cartService.cart$;
  promoCode = '';
  promoApplied = false;
  promoDiscount = 0;

  constructor(private router: Router) {}

  updateQuantity(productId: number, quantity: number) {
    this.cartService.updateQuantity(productId, quantity);
  }

  removeItem(productId: number) {
    this.cartService.removeFromCart(productId);
  }

  applyPromo() {
    if (this.promoCode === 'SUMMER2024') {
      this.promoApplied = true;
      this.promoDiscount = 0.1; // 10% скидка
    }
  }

  getDiscount(price: number, quantity: number): number {
    return this.promoApplied ? price * quantity * this.promoDiscount : 0;
  }

  getSubtotal(): number {
    const cart = this.cartService.getCurrentCart();
    return cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  getTotal(): number {
    const subtotal = this.getSubtotal();
    const discount = this.promoApplied ? subtotal * this.promoDiscount : 0;
    return subtotal - discount;
  }

  proceedToCheckout() {
    this.router.navigate(['/user', 'checkout']);
  }
}
