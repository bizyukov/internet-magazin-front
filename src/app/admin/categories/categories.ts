import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Category } from '../../core/models/category.model';
import { CategoryService } from '../../core/services/category';

@Component({
  selector: 'app-categories',
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class Categories {
  categories: Category[] = [];
  newCategoryName = '';
  isAdding = false;
  editId: number | null = null;
  editName = '';

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  startEdit(category: Category) {
    this.editId = category.id;
    this.editName = category.name;
  }

  saveEdit(categoryId: number) {
    if (!this.editName.trim()) return;

    this.categoryService
      .updateCategory(categoryId, { name: this.editName })
      .subscribe(() => {
        this.editId = null;
        this.loadCategories();
      });
  }

  cancelEdit() {
    this.editId = null;
  }

  addCategory() {
    if (!this.newCategoryName.trim() || this.isAdding) return;

    this.isAdding = true;
    this.categoryService
      .createCategory({ name: this.newCategoryName })
      .subscribe({
        next: () => {
          this.newCategoryName = '';
          this.isAdding = false;
          this.loadCategories();
        },
        error: () => {
          this.isAdding = false;
        },
      });
  }

  deleteCategory(categoryId: number) {
    if (
      confirm('Удалить категорию? Все товары в ней останутся без категории.')
    ) {
      this.categoryService.deleteCategory(categoryId).subscribe(() => {
        this.loadCategories();
      });
    }
  }
}
