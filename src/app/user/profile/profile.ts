import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth/services/auth';
import { UserService } from '../../core/services/user';
import { PasswordStrengthMeter } from '../../shared/components/password-strength-meter/password-strength-meter';

@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    //BootstrapInput,
    PasswordStrengthMeter,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  private fb = inject(FormBuilder);
  profileForm = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.pattern(/^\+7\d{10}$/)]],
  });

  passwordForm = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]],
  });

  isLoading = false;
  isPasswordLoading = false;
  profileSuccess = '';
  profileError = '';
  passwordSuccess = '';
  passwordError = '';
  passwordStrength = 0;

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.userService.getProfile().subscribe((profile) => {
      this.profileForm.patchValue(profile);
    });
  }

  updateProfile() {
    if (this.profileForm.invalid) return;

    this.isLoading = true;
    this.profileError = '';

    this.userService.updateProfile(this.profileForm.value).subscribe({
      next: () => {
        this.profileSuccess = 'Профиль успешно обновлен';
        this.isLoading = false;
      },
      error: () => {
        this.profileError = 'Ошибка обновления профиля';
        this.isLoading = false;
      },
    });
  }

  changePassword() {
    if (this.passwordForm.invalid) return;

    this.isPasswordLoading = true;
    this.passwordError = '';

    const { currentPassword, newPassword } = this.passwordForm.value;

    this.userService.changePassword(currentPassword!, newPassword!).subscribe({
      next: () => {
        this.passwordSuccess = 'Пароль успешно изменен';
        this.passwordForm.reset();
        this.isPasswordLoading = false;
      },
      error: () => {
        this.passwordError = 'Неверный текущий пароль';
        this.isPasswordLoading = false;
      },
    });
  }

  checkPasswordStrength() {
    const password = this.passwordForm.get('newPassword')?.value || '';
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    this.passwordStrength = strength;
  }
}
