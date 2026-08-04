import { OrderPaymentStatus, OrderStatus } from '@/lib/api/types/orders';
import type { Order } from '@/lib/api/types/orders';

enum LegacyOrderStatus {
  PAYMENT_PENDING = 'payment_pending',
}

type CancellableOrderStatus = OrderStatus | `${LegacyOrderStatus}`;

const CANCELLABLE_ORDER_STATUSES = new Set<CancellableOrderStatus>([
  OrderStatus.PENDING,
  OrderStatus.PROCESSING,
  LegacyOrderStatus.PAYMENT_PENDING,
]);

export function canCancelOrder(order: Order | null): boolean {
  return Boolean(order && CANCELLABLE_ORDER_STATUSES.has(order.status as CancellableOrderStatus));
}

export function canReturnOrder(order: Order | null, returnWindowDays: number = 30): boolean {
  if (!order || order.status !== OrderStatus.DELIVERED) return false;

  const deliveryReference = order.deliveredAt ?? order.createdAt;
  const daysSinceDelivery = (Date.now() - new Date(deliveryReference).getTime()) / (1000 * 60 * 60 * 24);
  return daysSinceDelivery <= returnWindowDays;
}

export function hasDigitalItems(order: Order | null): boolean {
  return order?.items.some((item) => item.isDigital || item.productType === 'digital') ?? false;
}

export function getDownloadableItems(order: Order | null): Order['items'] {
  if (!order) return [];

  const isPaid = order.isPaid || order.paymentStatus === OrderPaymentStatus.PAID || order.status === OrderStatus.DELIVERED;
  if (!isPaid) return [];

  return order.items.filter((item) => item.isDigital || item.productType === 'digital');
}

export function generateOrderNumber(prefix: string = 'ORD'): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}
