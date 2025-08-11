import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartSubject = new BehaviorSubject<Cart>({ items: [], total: 0 });
  cart$ = this.cartSubject.asObservable();

  constructor() {
    this.loadCartFromStorage();
  }

  getCurrentCart(): Cart {
    return this.cartSubject.value;
  }

  private loadCartFromStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartSubject.next(JSON.parse(savedCart));
    }
  }

  private saveCartToStorage(cart: Cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  addToCart(product: CartItem) {
    const currentCart = this.cartSubject.value;
    const existingItem = currentCart.items.find(
      (item) => item.productId === product.productId
    );

    if (existingItem) {
      existingItem.quantity += product.quantity;
    } else {
      currentCart.items.push({ ...product });
    }

    currentCart.total = this.calculateTotal(currentCart.items);
    this.cartSubject.next(currentCart);
    this.saveCartToStorage(currentCart);
  }

  removeFromCart(productId: number) {
    const currentCart = this.cartSubject.value;
    currentCart.items = currentCart.items.filter(
      (item) => item.productId !== productId
    );
    currentCart.total = this.calculateTotal(currentCart.items);
    this.cartSubject.next(currentCart);
    this.saveCartToStorage(currentCart);
  }

  updateQuantity(productId: number, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const currentCart = this.cartSubject.value;
    const item = currentCart.items.find((i) => i.productId === productId);

    if (item) {
      item.quantity = quantity;
      currentCart.total = this.calculateTotal(currentCart.items);
      this.cartSubject.next(currentCart);
      this.saveCartToStorage(currentCart);
    }
  }

  clearCart() {
    this.cartSubject.next({ items: [], total: 0 });
    localStorage.removeItem('cart');
  }

  private calculateTotal(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
}
