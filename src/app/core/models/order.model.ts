export interface Order {
  uuid: any;// Уникальный идентификатор заказа
  //id: string; 
  userId: string; // ID пользователя, сделавшего заказ
  createdAt: Date; // Дата и время оформления заказа

  // Информация о товарах
  items: OrderItem[];

  // Адрес доставки
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    region: string;
    zipCode: string;
    country: string;
    phone: string;
  };

  // Способ доставки
  shippingMethod: {
    name: string; // "Курьер", "Самовывоз", "Почта России"
    cost: number;
    estimatedDelivery: string; // "1-3 дня", "5-7 дней"
  };

  // Способ оплаты
  paymentMethod: {
    type: string; // "Картой онлайн", "Наличными при получении", "В рассрочку"
    details?: {
      cardLastDigits?: string; // Последние 4 цифры карты
      transactionId?: string; // ID транзакции
    };
  };

  // Статусы
  status: OrderStatus; // Общий статус заказа
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded'; // Статус оплаты
  shippingStatus:
    | 'processing'
    | 'shipped'
    | 'in_transit'
    | 'delivered'
    | 'cancelled'; // Статус доставки

  // Финансовая информация
  subtotal: number; // Сумма товаров
  shippingCost: number; // Стоимость доставки
  discount: number; // Сумма скидки
  total: number; // Итоговая сумма

  // Дополнительная информация
  trackingNumber?: string; // Трек-номер для отслеживания
  notes?: string; // Комментарии к заказу
  promoCode?: string; // Примененный промокод
}

export interface OrderItem {
  productId: number; // ID товара
  name: string; // Название товара
  price: number; // Цена за единицу на момент заказа
  quantity: number; // Количество
  imageUrl: string; // URL изображения товара
  sku?: string; // Артикул товара
}

// Типы статусов заказа
export type OrderStatus =
  | 'new' // Новый заказ
  | 'processing' // В обработке
  | 'confirmed' // Подтвержден
  | 'shipped' // Отправлен
  | 'delivered' // Доставлен
  | 'cancelled' // Отменен
  | 'returned'; // Возвращен

// Функция для получения текстового описания статуса
export function getOrderStatusText(status: OrderStatus): string {
  const statusMap: Record<OrderStatus, string> = {
    new: 'Новый',
    processing: 'В обработке',
    confirmed: 'Подтвержден',
    shipped: 'Отправлен',
    delivered: 'Доставлен',
    cancelled: 'Отменен',
    returned: 'Возвращен',
  };
  return statusMap[status] || status;
}
