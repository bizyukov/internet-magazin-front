import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Auth } from '../../auth/services/auth';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: Auth, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.isAuthenticated$.pipe(
      map((isAuthenticated) => {
        if (!isAuthenticated) {
          return this.router.createUrlTree(['/auth/login'], {
            queryParams: { returnUrl: this.router.url },
          });
        }
        return true;
      })
    );
  }
}
