import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { Product } from '../../core/models/product.model';
import { CartService } from '../../core/services/cart';
import { ProductService } from '../../core/services/product';
import { WishlistService } from '../../core/services/wishlist';
import { ProductCard } from '../../shared/components/product-card/product-card';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CurrencyPipe,
    DecimalPipe,
    NgbCarouselModule,
    ProductCard,
    FormsModule,
    RouterModule
  ],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.scss'],
})
export class ProductDetail implements OnInit {
  product: Product | null = null;
  relatedProducts: Product[] = [];
  selectedImage: string | null = null;
  quantity = 1;
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    protected cartService: CartService,
    protected wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const productId = +params['id'];
      this.loadProduct(productId);
    });
  }

  loadProduct(id: number): void {
    this.isLoading = true;
    this.error = null;

    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.selectedImage = product.images?.[0] || product.imageUrl || null;

        console.log('product', product);

        // Загрузка похожих товаров
        if (product.category?.id) {
          this.productService
            .getRelatedProducts(product.category.id, product.id)
            .subscribe((related) => {
              this.relatedProducts = related;
            });
        }
      },
      error: (err) => {
        this.error = 'Не удалось загрузить информацию о товаре';
        console.error(err);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  selectImage(image: string): void {
    this.selectedImage = image;
  }

  addToCart(): void {
    if (!this.product) return;

    this.cartService.addToCart({
      productId: this.product.id,
      name: this.product.name,
      price: this.product.price,
      imageUrl: this.product.images?.[0] || this.product.imageUrl || '',
      quantity: this.quantity,
    });
  }

  toggleWishlist(): void {
    if (!this.product) return;

    if (this.wishlistService.isInWishlist(this.product.id)) {
      this.wishlistService.removeFromWishlist(this.product.id);
    } else {
      this.wishlistService.addToWishlist(this.product);
    }
  }

  incrementQuantity(): void {
    if (this.quantity < 10) this.quantity++;
  }

  decrementQuantity(): void {
    if (this.quantity > 1) this.quantity--;
  }
}
