import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { Product } from '../../core/models/product.model';
import { SearchService } from '../../core/services/search';
import { ProductCard } from '../../shared/components/product-card/product-card';

@Component({
  selector: 'app-search-results',
  imports: [ProductCard],
  templateUrl: './search-results.html',
  styleUrl: './search-results.scss',
})
export class SearchResults implements OnInit {
  products: Product[] = [];
  searchQuery = '';
  isLoading = true;
  error: string | null = null;

  // Пагинация
  currentPage = 1;
  pageSize = 12;
  totalItems = 0;
  totalPages = 0;

  // Фильтры
  filterForm: FormGroup;
  showFilters = false;
  categories: any[] = [];
  brands: any[] = [];
  priceRanges = [
    { min: 0, max: 1000, label: 'До 1 000 ₽' },
    { min: 1000, max: 5000, label: '1 000 - 5 000 ₽' },
    { min: 5000, max: 10000, label: '5 000 - 10 000 ₽' },
    { min: 10000, max: null, label: 'Более 10 000 ₽' },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private searchService: SearchService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      category: [''],
      brand: [''],
      minPrice: [''],
      maxPrice: [''],
      inStock: [false],
      sort: ['relevance'],
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.searchQuery = params['q'] || '';
      this.currentPage = +params['page'] || 1;

      // Применяем фильтры из URL
      this.filterForm.patchValue({
        category: params['category'] || '',
        brand: params['brand'] || '',
        minPrice: params['minPrice'] || '',
        maxPrice: params['maxPrice'] || '',
        inStock: params['inStock'] === 'true' || false,
        sort: params['sort'] || 'relevance',
      });

      this.searchProducts();
    });

    // Реакция на изменение фильтров
    this.filterForm.valueChanges.pipe(debounceTime(500)).subscribe(() => {
      this.currentPage = 1;
      this.applyFilters();
    });
  }

  searchProducts() {
    /* if (!this.searchQuery) {
      this.router.navigate(['/']);
      return;
    } */

    this.isLoading = true;
    this.error = null;

    const filters = this.filterForm.value;

    this.searchService
      .searchProducts(this.searchQuery, this.currentPage, this.pageSize, {
        category: filters.category,
        brand: filters.brand,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        inStock: filters.inStock,
        sort: filters.sort,
      })
      .subscribe({
        next: (response) => {
          this.products = response.items;
          this.totalItems = response.total;
          this.totalPages = response.totalPages;

          // Извлекаем доступные фильтры (если API возвращает)
          /* if (response.filters) {
            this.categories = response.filters.categories || [];
            this.brands = response.filters.brands || [];
          } */
        },
        error: (err) => {
          this.error = 'Произошла ошибка при поиске товаров';
          console.error(err);
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  applyFilters() {
    const queryParams = {
      q: this.searchQuery,
      page: this.currentPage > 1 ? this.currentPage : null,
      ...this.filterForm.value,
    };

    // Удаляем пустые параметры
    Object.keys(queryParams).forEach((key) => {
      if (!queryParams[key] && queryParams[key] !== false) {
        delete queryParams[key];
      }
    });

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
    });
  }

  setPriceRange(min: number | null, max: number | null) {
    this.filterForm.patchValue({
      minPrice: min,
      maxPrice: max,
    });
  }

  clearFilters() {
    this.filterForm.reset({
      inStock: false,
      sort: 'relevance',
    });
  }

  changePage(page: number) {
    this.currentPage = page;
    this.applyFilters();
  }
}
