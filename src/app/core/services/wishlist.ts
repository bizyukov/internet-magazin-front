import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private wishlistSubject = new BehaviorSubject<any[]>([]);
  wishlist$ = this.wishlistSubject.asObservable();

  constructor() {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      this.wishlistSubject.next(JSON.parse(savedWishlist));
    }
  }

  addToWishlist(product: any) {
    const current = this.wishlistSubject.value;
    if (!current.some((item) => item.id === product.id)) {
      const updated = [...current, product];
      this.wishlistSubject.next(updated);
      localStorage.setItem('wishlist', JSON.stringify(updated));
    }
  }

  removeFromWishlist(productId: number) {
    const updated = this.wishlistSubject.value.filter(
      (item) => item.id !== productId
    );
    this.wishlistSubject.next(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistSubject.value.some((item) => item.id === productId);
  }
}
