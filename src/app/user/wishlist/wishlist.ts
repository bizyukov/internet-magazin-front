import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { WishlistService } from '../../core/services/wishlist';
import { CartService } from '../../core/services/cart';
import { ProductCard } from '../../shared/components/product-card/product-card';

@Component({
  selector: 'app-wishlist',
  imports: [CommonModule, ProductCard],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.scss',
})
export class Wishlist {
  private wishlistService = inject(WishlistService);
  wishlistItems$ = this.wishlistService.wishlist$;

  constructor(
    
    private cartService: CartService
  ) {}

  removeFromWishlist(productId: number) {
    this.wishlistService.removeFromWishlist(productId);
  }

  addToCart(product: any) {
    this.cartService.addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: 1,
    });
  }
}
