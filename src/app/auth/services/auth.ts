import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  userRole$ = new BehaviorSubject<'user' | 'admin' | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.isAuthenticatedSubject.next(true);
      this.determineUserRole(token);
    }
  }

  login(email: string, password: string): Observable<{ token: string }> {
    return this.http
      .post<{ token: string }>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((response) => {
          localStorage.setItem('auth_token', response.token);
          this.isAuthenticatedSubject.next(true);
          this.determineUserRole(response.token);
        })
      );
  }

  register(
    name: string,
    email: string,
    password: string
  ): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/register`, {
      name,
      email,
      password,
    });
  }

  forgotPassword(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/forgot-password`,
      { email }
    );
  }

  logout() {
    localStorage.removeItem('auth_token');
    this.isAuthenticatedSubject.next(false);
    this.userRole$.next(null);
    this.router.navigate(['/auth/login']);
  }

  private determineUserRole(token: string) {
    // В реальном приложении декодируем JWT для получения роли
    const role = token.includes('admin') ? 'admin' : 'user';
    this.userRole$.next(role);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
}
