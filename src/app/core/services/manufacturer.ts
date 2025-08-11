import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Manufacturer } from '../models/manufacturer.model';

@Injectable({
  providedIn: 'root',
})
export class ManufacturerService {
  private apiUrl = 'http://localhost:3000/manufacturers';

  constructor(private http: HttpClient) {}

  /**
   * Получение всех производителей
   */
  getAllManufacturers(): Observable<Manufacturer[]> {
    return this.http.get<Manufacturer[]>(this.apiUrl);
  }

  /**
   * Создание нового производителя
   * @param manufacturerData Данные производителя
   */
  createManufacturer(manufacturerData: {
    name: string;
  }): Observable<Manufacturer> {
    return this.http.post<Manufacturer>(this.apiUrl, manufacturerData);
  }

  /**
   * Обновление производителя
   * @param manufacturerId ID производителя
   * @param manufacturerData Данные производителя
   */
  updateManufacturer(
    manufacturerId: number,
    manufacturerData: { name: string }
  ): Observable<Manufacturer> {
    return this.http.put<Manufacturer>(
      `${this.apiUrl}/${manufacturerId}`,
      manufacturerData
    );
  }

  /**
   * Удаление производителя
   * @param manufacturerId ID производителя
   */
  deleteManufacturer(manufacturerId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${manufacturerId}`);
  }

  /**
   * Получение производителя по ID
   * @param manufacturerId ID производителя
   */
  getManufacturerById(manufacturerId: number): Observable<Manufacturer> {
    return this.http.get<Manufacturer>(`${this.apiUrl}/${manufacturerId}`);
  }
}
