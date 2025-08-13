import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { interval } from 'rxjs';
import { AuthService } from './auth/services/auth';
import { Footer } from './core/components/footer/footer';
import { Header } from './core/components/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly title = signal('Интернет-магазин');

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Проверяем токен каждые 5 минут
    interval(300000).subscribe(() => {
      if (this.authService.getAccessToken()) {
        this.authService.refreshToken().subscribe();
      }
    });
  }
}
