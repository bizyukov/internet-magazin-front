import { Routes } from '@angular/router';
import { ForgotPassword } from './forgot-password/forgot-password';
import { Login } from './login/login';
import { Register } from './register/register';

export const AUTH_ROUTES: Routes = [
  { path: 'login', component: Login, title: 'Вход' },
  { path: 'register', component: Register, title: 'Регистрация' },
  {
    path: 'forgot-password',
    component: ForgotPassword,
    title: 'Восстановление пароля',
  },
  //{ path: '', redirectTo: 'login', pathMatch: 'full' },
];
