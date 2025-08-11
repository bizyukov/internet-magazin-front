import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = 'http://localhost:3000/categories';

  constructor(private http: HttpClient) {}

  /**
   * Получение всех категорий
   * @returns Observable с массивом категорий
   */
  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  /**
   * Создание новой категории
   * @param categoryData Данные категории
   */
  createCategory(categoryData: { name: string }): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, categoryData);
  }

  /**
   * Обновление категории
   * @param categoryId ID категории
   * @param categoryData Данные категории
   */
  updateCategory(
    categoryId: number,
    categoryData: { name: string }
  ): Observable<Category> {
    return this.http.put<Category>(
      `${this.apiUrl}/${categoryId}`,
      categoryData
    );
  }

  /**
   * Удаление категории
   * @param categoryId ID категории
   */
  deleteCategory(categoryId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${categoryId}`);
  }

  /**
   * Получение категории по ID
   * @param categoryId ID категории
   */
  getCategoryById(categoryId: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${categoryId}`);
  }
}
