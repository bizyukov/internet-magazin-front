import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
//import { Spinner } from 'src/app/shared/components/spinner/spinner';
import { PasswordStrengthMeter } from '../../shared/components/password-strength-meter/password-strength-meter';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, // Добавлен ReactiveFormsModule
    RouterModule,
    PasswordStrengthMeter,
    //Spinner,
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
})
export class Register {
  registerForm: FormGroup; // Используем FormGroup
  isLoading = false;
  errorMessage = '';
  passwordStrength = 0;

  constructor(
    private fb: FormBuilder, // Инжектируем FormBuilder
    private authService: AuthService,
    private router: Router
  ) {
    // Инициализируем форму с валидаторами
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  checkPasswordStrength() {
    const password = this.registerForm.get('password')?.value || '';
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    this.passwordStrength = strength;
  }

  onSubmit() {
    console.log('onSubmit');
    if (this.registerForm.invalid) {
      this.errorMessage = 'Пожалуйста, заполните все поля правильно';
      return;
    }

    if (
      this.registerForm.value.password !==
      this.registerForm.value.confirmPassword
    ) {
      this.errorMessage = 'Пароли не совпадают';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService
      .register(
        /* { */
        /* name: */ this.registerForm.value.name,
        /* email: */ this.registerForm.value.email,
        /* password: */ this.registerForm.value.password
        /* } */
      )
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/']);
        },
        error: (error: { error: { message: string } }) => {
          this.errorMessage = error.error?.message || 'Ошибка регистрации';
          this.isLoading = false;
        },
      });
  }
}
