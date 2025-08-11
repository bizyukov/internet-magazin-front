import { Order, OrderStatus } from '../models/order.model';

/**
 * Рассчитывает итоговую стоимость заказа
 */
export function calculateOrderTotal(order: Partial<Order>): number {
  const subtotal =
    order.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) ||
    0;
  const shippingCost = order.shippingCost || 0;
  const discount = order.discount || 0;
  return subtotal + shippingCost - discount;
}

/**
 * Проверяет, можно ли повторить заказ
 * (заказы со статусом "доставлен" или "отменен" можно повторить)
 */
export function canRepeatOrder(order: Order): boolean {
  return ['delivered', 'cancelled'].includes(order.status);
}

/**
 * Проверяет, можно ли отменить заказ
 * (только заказы со статусом "новый" или "в обработке")
 */
export function canCancelOrder(order: Order): boolean {
  return ['new', 'processing'].includes(order.status);
}

/**
 * Возвращает класс для отображения статуса
 */
export function getStatusBadgeClass(status: OrderStatus): string {
  switch (status) {
    case 'new':
      return 'bg-info';
    case 'processing':
      return 'bg-primary';
    case 'confirmed':
      return 'bg-secondary';
    case 'shipped':
      return 'bg-warning text-dark';
    case 'delivered':
      return 'bg-success';
    case 'cancelled':
      return 'bg-danger';
    case 'returned':
      return 'bg-dark';
    default:
      return 'bg-light text-dark';
  }
}
