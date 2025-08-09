import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BootstrapInput } from './bootstrap-input';

describe('BootstrapInput', () => {
  let component: BootstrapInput;
  let fixture: ComponentFixture<BootstrapInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BootstrapInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BootstrapInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
