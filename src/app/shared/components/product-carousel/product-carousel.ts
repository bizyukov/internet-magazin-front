import { CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-carousel',
  imports: [CurrencyPipe, RouterModule],
  templateUrl: './product-carousel.html',
  styleUrl: './product-carousel.scss',
})
export class ProductCarousel {
  @Input() products: Product[] = [];
  @Input() title = 'Рекомендуемые товары';
  @Input() seeAllLink = '/products/featured';

  addToCart(product: Product) {
    // Логика добавления в корзину
  }
}
