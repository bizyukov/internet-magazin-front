import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  Observable,
  switchMap,
  tap,
  throwError,
} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private API_URL = 'http://localhost:3000/auth';
  private tokenRefreshInProgress = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  isAuthenticated$ = new BehaviorSubject<boolean>(this.hasValidToken());
  userRole$ = new BehaviorSubject<'user' | 'admin' | null>(null);

  private inactivityTimeout = 60 * 1000 * 1; // 1 минут
  private inactivityTimer: any;

  constructor(private http: HttpClient, private router: Router) {
    this.checkTokenOnStartup();
    //this.setupActivityListeners();
  }

  login(
    email: string,
    password: string
  ): Observable<{ accessToken: string; refreshToken: string }> {
    return this.http
      .post<{ accessToken: string; refreshToken: string }>(
        `${this.API_URL}/login`,
        { email, password }
      )
      .pipe(
        tap((tokens) => {
          this.storeTokens(tokens);
          this.isAuthenticated$.next(true);
          this.decodeAndSetUserRole(tokens.accessToken);
        })
      );
  }

  register(
    name: string,
    email: string,
    password: string
  ): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.API_URL}/register`, {
      name,
      email,
      password,
    });
  }

  forgotPassword(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.API_URL}/forgot-password`,
      { email }
    );
  }

  logout() {
    //alert('logout');
    this.removeTokens();
    this.isAuthenticated$.next(false);
    this.userRole$.next(null);
    this.router.navigate(['/']);
  }

  refreshToken(): Observable<{ accessToken: string; refreshToken: string }> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token'));
    }

    if (this.tokenRefreshInProgress) {
      return this.refreshTokenSubject.pipe(
        switchMap((token) =>
          token
            ? this.http.post<{ accessToken: string; refreshToken: string }>(
                `${this.API_URL}/token`,
                { token }
              )
            : throwError(() => new Error('Refresh failed'))
        )
      );
    }

    this.tokenRefreshInProgress = true;
    this.refreshTokenSubject.next(null);

    return this.http
      .post<{ accessToken: string; refreshToken: string }>(
        `${this.API_URL}/refresh`,
        { refreshToken }
      )
      .pipe(
        tap((tokens) => {
          this.storeTokens(tokens);
          this.tokenRefreshInProgress = false;
          this.refreshTokenSubject.next(tokens.accessToken);
          this.decodeAndSetUserRole(tokens.accessToken);
        }),
        catchError((err) => {
          this.tokenRefreshInProgress = false;
          this.logout();
          return throwError(() => err);
        })
      );
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  private storeTokens(tokens: { accessToken: string; refreshToken: string }) {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  }

  private removeTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  private hasValidToken(): boolean {
    const token = this.getAccessToken();
    return !!token && !this.isTokenExpired(token);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp < Date.now() / 1000;
    } catch {
      return true;
    }
  }

  private decodeAndSetUserRole(token: string) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.userRole$.next(payload.role);
    } catch {
      this.userRole$.next(null);
    }
  }

  private checkTokenOnStartup() {
    if (this.hasValidToken()) {
      this.decodeAndSetUserRole(this.getAccessToken()!);
    } else if (this.getRefreshToken()) {
      this.refreshToken().subscribe();
    } else {
      this.logout();
    }
  }

  resetInactivityTimer() {
    clearTimeout(this.inactivityTimer);
    this.inactivityTimer = setTimeout(() => {
      this.logout();
    }, this.inactivityTimeout);
  }

  setupActivityListeners() {
    window.addEventListener('mousemove', this.resetInactivityTimer.bind(this));
    window.addEventListener('keypress', this.resetInactivityTimer.bind(this));
    window.addEventListener('scroll', this.resetInactivityTimer.bind(this));
    window.addEventListener('click', this.resetInactivityTimer.bind(this));

    this.resetInactivityTimer();
  }

  get isAuthenticated(): boolean {
    return this.isAuthenticated$.value;
  }

  getCurrentUserId(): string | null {
    const token = this.getToken();
    console.log('token', token);
    if (!token) return null;

    // Декодирование JWT токена для получения ID пользователя
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId || payload.sub;
    } catch (e) {
      return null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  /* private determineUserRole(token: string) {
    // В реальном приложении декодируем JWT для получения роли
    const role = token.includes('admin') ? 'admin' : 'user';
    this.userRole$.next(role);
  } */

  /* getToken(): string | null {
    return localStorage.getItem('auth_token');
  } */
}
