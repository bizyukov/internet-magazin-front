import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-bootstrap-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './bootstrap-input.html',
  styleUrl: './bootstrap-input.scss',
})
export class BootstrapInput {
  @Input() label = '';
  @Input() type = 'text';
  @Input() controlName = '';
  @Input() placeholder = '';
  @Input() errors: any = null;
  @Input() showErrors = false;

  get controlErrors() {
    return this.errors;
  }
}
