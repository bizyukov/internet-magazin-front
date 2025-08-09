import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordStrengthMeter } from './password-strength-meter';

describe('PasswordStrengthMeter', () => {
  let component: PasswordStrengthMeter;
  let fixture: ComponentFixture<PasswordStrengthMeter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordStrengthMeter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordStrengthMeter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
