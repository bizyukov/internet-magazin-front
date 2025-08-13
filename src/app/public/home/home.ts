import { Component } from '@angular/core';
import { lastValueFrom, map } from 'rxjs';
import { Category } from '../../core/models/category.model';
import { Product } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product';
import { CategoryGrid } from '../../shared/components/category-grid/category-grid';
import { HeroBanner } from '../../shared/components/hero-banner/hero-banner';
import { ProductCarousel } from '../../shared/components/product-carousel/product-carousel';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  imports: [ProductCarousel, CategoryGrid, HeroBanner],
})
export class Home {
  featuredProducts: Product[] = [];
  newArrivals: Product[] = [];
  categories: Category[] = [];
  isLoading = true;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    try {
      this.featuredProducts = await lastValueFrom(
        this.productService
          .getFeaturedProducts(6)
          .pipe(map((data) => data.items))
      );
      this.newArrivals = await lastValueFrom(
        this.productService.getNewArrivals(4).pipe(map((data) => data.items))
      );

      this.categories = await lastValueFrom(
        this.productService.getCategories()
      );
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      this.isLoading = false;
    }
  }
}
