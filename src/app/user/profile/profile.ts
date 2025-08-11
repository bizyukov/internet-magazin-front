import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../auth/services/auth';
import { User } from '../../core/services/user';
import { BootstrapInput } from '../../shared/components/bootstrap-input/bootstrap-input';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule, BootstrapInput],
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

  constructor(private userService: User, private authService: Auth) {}

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
      error: (err) => {
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
      error: (err) => {
        this.passwordError = 'Неверный текущий пароль';
        this.isPasswordLoading = false;
      },
    });
  }
}
