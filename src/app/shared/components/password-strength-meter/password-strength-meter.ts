import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-password-strength-meter',
  imports: [CommonModule],
  templateUrl: './password-strength-meter.html',
  styleUrl: './password-strength-meter.scss',
})
export class PasswordStrengthMeter {
  @Input() password = '';
  strength = 0;

  ngOnChanges() {
    this.calculateStrength();
  }

  private calculateStrength() {
    let strength = 0;
    if (this.password.length >= 8) strength += 25;
    if (/[A-Z]/.test(this.password)) strength += 25;
    if (/[0-9]/.test(this.password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(this.password)) strength += 25;
    this.strength = strength;
  }
}
