import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Manufacturers } from './manufacturers';

describe('Manufacturers', () => {
  let component: Manufacturers;
  let fixture: ComponentFixture<Manufacturers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Manufacturers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Manufacturers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
