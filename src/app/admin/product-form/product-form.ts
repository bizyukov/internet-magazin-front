import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Category } from '../../core/models/category.model';
import { Manufacturer } from '../../core/models/manufacturer.model';
import { Product } from '../../core/models/product.model';
import { CategoryService } from '../../core/services/category';
import { ManufacturerService } from '../../core/services/manufacturer';
import { ProductService } from '../../core/services/product';

@Component({
  selector: 'app-product-form',
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
})
export class ProductForm implements OnInit {
  private fb = inject(FormBuilder);
  productForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(255)]],
    description: ['', [Validators.required]],
    sku: ['', [Validators.maxLength(50)]],
    price: [0, [Validators.required, Validators.min(0)]],
    oldPrice: [0, [Validators.min(0)]],
    stockQuantity: [0, [Validators.required, Validators.min(0)]],
    imageUrl: ['', [Validators.required]],
    categoryId: ['', [Validators.required]],
    manufacturerId: [null, [Validators.required]],
    isActive: [true],
    specifications: this.fb.group({
      weight: [0],
      dimensions: [''],
      material: [''],
      color: [''],
    }),
  });

  categories: Category[] = [];
  manufacturers: Manufacturer[] = [];
  isEditMode = false;
  productId: number | null = null;
  isLoading = false;
  formError = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService,
    private manufacturerService: ManufacturerService
  ) {}

  ngOnInit() {
    this.loadDependencies();

    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.productId = +params['id'];
        this.loadProduct(this.productId);
      }
    });
  }

  loadDependencies() {
    this.categoryService
      .getAllCategories()
      .subscribe((categories: Category[]) => {
        this.categories = categories;
      });

    this.manufacturerService
      .getAllManufacturers()
      .subscribe((manufacturers) => {
        this.manufacturers = manufacturers.items;
      });
  }

  loadProduct(id: number) {
    this.isLoading = true;
    this.productService.getProductById(id).subscribe((product) => {
      this.productForm.patchValue(product as any);
      this.isLoading = false;
    });
  }

  onSubmit() {
    if (this.productForm.invalid) return;

    this.isLoading = true;
    this.formError = '';

    const productData = this.productForm.value as unknown as Product;

    const request =
      this.isEditMode && this.productId
        ? this.productService.updateProduct(this.productId, productData)
        : this.productService.createProduct(productData);

    request.subscribe({
      next: () => {
        this.router.navigate(['/admin/products']);
      },
      error: (err) => {
        this.formError = 'Ошибка сохранения товара';
        this.isLoading = false;
      },
    });
  }
}
