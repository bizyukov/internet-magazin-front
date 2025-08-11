import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart';
import { WishlistService } from '../../../core/services/wishlist';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  @Input() product: any;
  isInWishlist = false;

  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit() {
    this.isInWishlist = this.wishlistService.isInWishlist(this.product.id);
  }

  addToCart() {
    this.cartService.addToCart({
      productId: this.product.id,
      name: this.product.name,
      price: this.product.price,
      imageUrl: this.product.imageUrl,
      quantity: 1,
    });
  }

  toggleWishlist() {
    if (this.isInWishlist) {
      this.wishlistService.removeFromWishlist(this.product.id);
    } else {
      this.wishlistService.addToWishlist(this.product);
    }
    this.isInWishlist = !this.isInWishlist;
  }
}
