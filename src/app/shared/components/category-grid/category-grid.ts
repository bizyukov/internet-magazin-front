import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-category-grid',
  imports: [RouterModule],
  templateUrl: './category-grid.html',
  styleUrl: './category-grid.scss',
})
export class CategoryGrid {
  @Input() categories: Category[] = [];
}
