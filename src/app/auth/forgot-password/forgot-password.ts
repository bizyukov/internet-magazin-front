import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BootstrapInput } from '../../shared/components/bootstrap-input/bootstrap-input';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, BootstrapInput],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.scss'],
})
export class ForgotPassword {
  private fb = inject(FormBuilder);
  forgotForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private authService: Auth, private router: Router) {}

  onSubmit() {
    if (this.forgotForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const email = this.forgotForm.value.email!;

    this.authService.forgotPassword(email).subscribe({
      next: () => {
        this.successMessage =
          'Инструкции по восстановлению отправлены на ваш email';
        setTimeout(() => this.router.navigate(['/auth/login']), 3000);
      },
      error: (err: { message: string }) => {
        this.errorMessage = err.message || 'Ошибка восстановления пароля';
        this.isLoading = false;
      },
    });
  }

  get email() {
    return this.forgotForm.get('email');
  }
}
