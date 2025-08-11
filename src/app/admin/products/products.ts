import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Product } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product';

@Component({
  selector: 'app-products',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products {
  products: Product[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  isLoading = true;
  searchQuery = '';
  totalPages = 1;

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading = true;
    this.productService
      .getAdminProducts(this.currentPage, this.itemsPerPage, this.searchQuery)
      .subscribe((response) => {
        this.products = response.items;
        this.totalItems = response.total;
        this.isLoading = false;
        this.totalPages = response.totalPages;
      });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadProducts();
  }

  searchProducts() {
    this.currentPage = 1;
    this.loadProducts();
  }

  deleteProduct(productId: number) {
    if (confirm('Удалить товар? Это действие нельзя отменить.')) {
      this.productService.deleteProduct(productId).subscribe(() => {
        this.loadProducts();
      });
    }
  }
}
