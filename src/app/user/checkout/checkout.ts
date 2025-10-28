import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { tap } from 'rxjs';
import { AuthService } from '../../auth/services/auth';
import { Address } from '../../core/models/address.model';
import { PaymentMethod } from '../../core/models/payment-method.model';
import { CartService } from '../../core/services/cart';
import { CheckoutService } from '../../core/services/checkout';

@Component({
  selector: 'app-checkout',
  imports: [CurrencyPipe, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class Checkout {
  // Шаги оформления
  currentStep = 1;
  steps = ['Доставка', 'Оплата', 'Подтверждение'];

  // Данные
  cartItems: any[] = [];
  addresses: Address[] = [];
  paymentMethods: PaymentMethod[] = [];
  selectedAddress?: Address;
  selectedPayment?: PaymentMethod;
  newAddressForm: FormGroup;
  newPaymentForm: FormGroup;
  orderComment = '';
  promoCode = '';
  discount = 0;
  isLoading = false;
  orderCreated = false;
  orderUuid: string | null = null;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private authService: AuthService,
    private router: Router
  ) {
    // Форма нового адреса
    this.newAddressForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      phone: [
        '',
        [Validators.required /* , Validators.pattern(/^\+7\d{10}$/) */],
      ],
      country: ['Россия', [Validators.required]],
      region: ['', [Validators.required]],
      city: ['', [Validators.required]],
      street: ['', [Validators.required]],
      building: ['', [Validators.required]],
      apartment: [''],
      zipCode: [
        '',
        [Validators.required /* , Validators.pattern(/^\d{6}$/) */],
      ],
      isDefault: [false],
    });

    // Форма новой карты
    this.newPaymentForm = this.fb.group({
      cardNumber: [
        '',
        [Validators.required /* Validators.pattern(/^\d{16}$/) */],
      ],
      cardHolder: ['', [Validators.required /* Validators.minLength(3) */]],
      expiryDate: [
        '',
        [
          Validators.required /* , Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/) */,
        ],
      ],
      cvv: ['', [Validators.required /* , Validators.pattern(/^\d{3}$/) */]],
      isDefault: [false],
    });
  }

  ngOnInit(): void {
    this.loadCart();
    this.loadAddresses();
    this.loadPaymentMethods();
  }

  loadCart() {
    const cart = this.cartService.getCurrentCart();
    this.cartItems = cart.items;
  }

  loadAddresses() {
    this.checkoutService.getUserAddresses().subscribe({
      next: (addresses) => {
        this.addresses = addresses;
        this.selectedAddress =
          addresses.find((a) => a.isDefault) || addresses[0];
      },
      error: () => {
        this.addresses = [];
      },
    });
  }

  loadPaymentMethods() {
    this.checkoutService.getUserPaymentMethods().subscribe({
      next: (methods) => {
        this.paymentMethods = methods;
        this.selectedPayment = methods.find((m) => m.isDefault) || methods[0];
      },
      error: () => {
        this.paymentMethods = [];
      },
    });
  }

  addNewAddress() {
    if (this.newAddressForm.invalid) return;

    this.checkoutService.createAddress(this.newAddressForm.value).subscribe({
      next: (address) => {
        this.addresses.push(address);
        this.selectedAddress = address;
        this.newAddressForm.reset();
        // Закрываем модальное окно или форму
      },
      error: () => {
        // Обработка ошибки
      },
    });
  }

  addNewPaymentMethod() {
    if (this.newPaymentForm.invalid) return;

    const paymentFormData = this.newPaymentForm.getRawValue();

    const paymentMethodData = {
      details: {
        cardNumber: paymentFormData.cardNumber,
        expiry: paymentFormData.expiryDate,
        cardHolder: paymentFormData.cardHolder,
        cvv: paymentFormData.cvv,
      },
      isDefault: paymentFormData.isDefault,
      type: 'card',
    };

    this.checkoutService.createPaymentMethod(paymentMethodData).subscribe({
      next: (method) => {
        this.paymentMethods.push(method);
        this.selectedPayment = method;
        this.newPaymentForm.reset();
        // Закрываем модальное окно или форму
      },
      error: () => {
        // Обработка ошибки
      },
    });
  }

  applyPromoCode() {
    // В реальном приложении здесь будет запрос к серверу
    if (this.promoCode === 'SUMMER2024') {
      this.discount = 0.1; // 10% скидка
    } else {
      this.discount = 0;
      // Показать сообщение об ошибке
    }
  }

  getSubtotal(): number {
    return this.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  getShippingCost(): number {
    // Логика расчета доставки
    return 500; // Фиксированная стоимость
  }

  getTotal(): number {
    const subtotal = this.getSubtotal();
    const shipping = this.getShippingCost();
    return subtotal + shipping - subtotal * this.discount;
  }

  nextStep() {
    if (this.currentStep < this.steps.length) {
      this.currentStep++;
    } else if (this.currentStep === this.steps.length) {
      this.placeOrder();
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  placeOrder() {
    if (!this.selectedAddress || !this.selectedPayment) return;

    this.isLoading = true;

    const orderData = {
      shippingAddressId: this.selectedAddress.id,
      billingAddressId: this.selectedAddress.id, // Можно указать другой для счетов
      paymentMethodId: this.selectedPayment.id,
      items: this.cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      promoCode: this.promoCode || undefined,
      comment: this.orderComment || undefined,
    };

    this.checkoutService
      .createOrder(orderData)
      .pipe(
        tap((order) => {
          console.log('createOrder1', order);
          /* this.orderUuid = order.uuid;
        this.orderCreated = true;
        this.cartService.clearCart();
        this.isLoading = false;
        this.currentStep++; */
        })
      )
      .subscribe({
        next: (order) => {
          console.log('createOrder2', order);
          this.orderUuid = order.uuid;
          this.orderCreated = true;
          this.cartService.clearCart();
          this.isLoading = false;
          this.currentStep++;
        },
        error: (err) => {
          console.error('Order creation failed', err);
          this.isLoading = false;
          // Показать сообщение об ошибке
        },
      });
  }

  continueShopping() {
    this.router.navigate(['/']);
  }
}
