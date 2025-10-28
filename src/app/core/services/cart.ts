import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { AuthService } from '../../auth/services/auth';

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

interface AddToCartDto {
  productId: number;
  quantity: number;
}

interface CartResponseDto {
  items: CartItem[];
  total: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartSubject = new BehaviorSubject<Cart>(this.loadInitialCart());
  cart$ = this.cartSubject.asObservable();
  private apiUrl = 'http://localhost:3000/cart';

  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.syncCartWithServer();
      }
    });
  }

  private loadInitialCart(): Cart {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : { items: [], total: 0 };
  }

  getCurrentCart(): Cart {
    return this.cartSubject.value;
  }

  /* private loadCartFromStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartSubject.next(JSON.parse(savedCart));
    }
  } */

  private updateLocalCart(cart: Cart) {
    this.cartSubject.next(cart);
    this.saveCartToStorage(cart);
  }

  private saveCartToStorage(cart: Cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  /* private saveCartToStorage(cart: Cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  } */

  addToCart(product: CartItem) {
    const currentCart = this.cartSubject.value;
    const existingItem = currentCart.items.find(
      (item) => item.productId === product.productId
    );

    if (existingItem) {
      existingItem.quantity += product.quantity;
    } else {
      currentCart.items.push({ ...product });
    }

    currentCart.total = this.calculateTotal(currentCart.items);
    this.updateLocalCart(currentCart);

    console.log(
      'this.authService.isAuthenticated',
      this.authService.isAuthenticated
    );

    const userId = this.authService.getCurrentUserId();
    console.log('userId', userId);
    // Отправка на сервер, если пользователь авторизован
    if (this.authService.isAuthenticated) {
      this.sendToServer(product);
    }
  }

  private sendToServer(product: CartItem) {
    const userId = this.authService.getCurrentUserId();
    if (!userId) return;

    const addToCartDto: AddToCartDto = {
      productId: product.productId,
      quantity: product.quantity,
    };

    this.http
      .post<CartResponseDto>(`${this.apiUrl}/items`, addToCartDto, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        tap((serverCart) => {
          // Обновляем локальную корзину данными с сервера
          this.updateLocalCart(serverCart);
        }),
        catchError((error) => {
          console.error('Ошибка синхронизации корзины с сервером', error);
          // Можно добавить уведомление пользователю
          return throwError(() => error);
        })
      )
      .subscribe();
  }

  private syncCartWithServer() {
    const userId = this.authService.getCurrentUserId();
    if (!userId) return;

    this.http
      .get<CartResponseDto>(`${this.apiUrl}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        tap((serverCart) => {
          // При синхронизации используем данные с сервера
          this.updateLocalCart(serverCart);
        }),
        catchError((error) => {
          console.error('Ошибка загрузки корзины с сервера', error);
          return throwError(() => error);
        })
      )
      .subscribe();
  }

  removeFromCart(productId: number) {
    console.log('productId', productId);
    const currentCart = this.cartSubject.value;
    currentCart.items = currentCart.items.filter(
      (item) => item.productId !== productId
    );
    currentCart.total = this.calculateTotal(currentCart.items);
    this.updateLocalCart(currentCart);

    if (this.authService.isAuthenticated) {
      this.syncRemoveFromServer(productId);
    }
  }

  /* removeFromCart(productId: number) {
    const currentCart = this.cartSubject.value;
    currentCart.items = currentCart.items.filter(
      (item) => item.productId !== productId
    );
    currentCart.total = this.calculateTotal(currentCart.items);
    this.cartSubject.next(currentCart);
    this.saveCartToStorage(currentCart);
  } */

  private syncRemoveFromServer(productId: number) {
    const userId = this.authService.getCurrentUserId();
    if (!userId) return;

    this.http
      .delete(`${this.apiUrl}/items/${productId}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error('Ошибка удаления товара из корзины на сервере', error);
          return throwError(() => error);
        })
      )
      .subscribe();
  }

  updateQuantity(productId: number, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const currentCart = this.cartSubject.value;
    const item = currentCart.items.find((i) => i.productId === productId);

    if (item) {
      item.quantity = quantity;
      currentCart.total = this.calculateTotal(currentCart.items);
      this.updateLocalCart(currentCart);

      if (this.authService.isAuthenticated) {
        this.syncUpdateQuantityOnServer(productId, quantity);
      }
    }
  }

  /* updateQuantity(productId: number, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const currentCart = this.cartSubject.value;
    const item = currentCart.items.find((i) => i.productId === productId);

    if (item) {
      item.quantity = quantity;
      currentCart.total = this.calculateTotal(currentCart.items);
      this.cartSubject.next(currentCart);
      this.saveCartToStorage(currentCart);
    }
  } */

  private syncUpdateQuantityOnServer(productId: number, quantity: number) {
    const userId = this.authService.getCurrentUserId();
    if (!userId) return;

    this.http
      .put(
        `${this.apiUrl}/items/${productId}`,
        { quantity },
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        catchError((error) => {
          console.error('Ошибка обновления количества на сервере', error);
          return throwError(() => error);
        })
      )
      .subscribe();
  }

  /* clearCart() {
    this.cartSubject.next({ items: [], total: 0 });
    localStorage.removeItem('cart');
  } */

  clearCart() {
    const emptyCart = { items: [], total: 0 };
    this.updateLocalCart(emptyCart);

    if (this.authService.isAuthenticated) {
      this.syncClearCartOnServer();
    }
  }

  private syncClearCartOnServer() {
    const userId = this.authService.getCurrentUserId();
    if (!userId) return;

    this.http
      .delete(`${this.apiUrl}`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Ошибка очистки корзины на сервере', error);
          return throwError(() => error);
        })
      )
      .subscribe();
  }

  isInCart(productId: number): boolean {
    return this.getCurrentCart().items.some(
      (item) => item.productId === productId
    );
  }

  private calculateTotal(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  /* private calculateTotal(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  } */

  private getAuthHeaders() {
    const token = this.authService.getToken();
    return {
      Authorization: `Bearer ${token}`,
    };
  }
}
