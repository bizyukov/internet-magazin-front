// home.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductService } from '../../core/services/product';
import { Home } from './home';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;

  beforeEach(async () => {
    productServiceSpy = jasmine.createSpyObj('ProductService', [
      'getFeaturedProducts',
      'getNewArrivals',
      'getCategories',
    ]);

    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [{ provide: ProductService, useValue: productServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load data on init', async () => {
    productServiceSpy.getFeaturedProducts.and.returnValue(Promise.resolve([]));
    productServiceSpy.getNewArrivals.and.returnValue(Promise.resolve([]));
    productServiceSpy.getCategories.and.returnValue(Promise.resolve([]));

    component.ngOnInit();
    await fixture.whenStable();

    expect(component.isLoading).toBeFalse();
    expect(productServiceSpy.getFeaturedProducts).toHaveBeenCalledWith(6);
  });

  it('should display loading indicator', () => {
    component.isLoading = true;
    fixture.detectChanges();
    const spinner = fixture.nativeElement.querySelector('.spinner-border');
    expect(spinner).toBeTruthy();
  });
});
