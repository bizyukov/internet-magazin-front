import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PaginatedResponse } from '../models/paginated-response.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000/user';
  private adminApiUrl = 'http://localhost:3000/admin/users';
  private profileSubject = new BehaviorSubject<any>(null);
  profile$ = this.profileSubject.asObservable();

  constructor(private http: HttpClient) {}

  getProfile() {
    return this.http.get(`${this.apiUrl}/profile`);
  }

  updateProfile(profileData: any) {
    return this.http.put(`${this.apiUrl}/profile`, profileData);
  }

  changePassword(currentPassword: string, newPassword: string) {
    return this.http.post(`${this.apiUrl}/change-password`, {
      currentPassword,
      newPassword,
    });
  }

  getUsers(
    page: number = 1,
    limit: number = 10,
    role?: 'user' | 'admin',
    search?: string
  ): Observable<PaginatedResponse<User>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (role) {
      params = params.set('role', role);
    }

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<PaginatedResponse<User>>(this.adminApiUrl, { params });
  }

  updateUserStatus(userId: string, isActive: boolean): Observable<User> {
    return this.http.patch<User>(`${this.adminApiUrl}/${userId}/status`, {
      isActive,
    });
  }

  updateUserRole(userId: string, role: 'user' | 'admin'): Observable<User> {
    return this.http.patch<User>(`${this.adminApiUrl}/${userId}/role`, {
      role,
    });
  }

  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.adminApiUrl}/${userId}`);
  }
}
