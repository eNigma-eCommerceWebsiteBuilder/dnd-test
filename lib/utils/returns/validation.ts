import { OrderStatus, type Order } from '@/lib/api/types/orders';
import { ReturnReasonCode, type ReturnReason } from '@/lib/api/types/returns';
import type { ValidationResult } from '../validation/index';
import { calculateReturnDeadline } from './calculations';

export function validateReturnEligibility(
  order: Order | null | undefined,
  items: Array<{ productId: string; quantity: number }>,
  returnWindowDays: number = 30,
): ValidationResult {
  if (!order) {
    return { valid: false, error: 'Order not found' };
  }

  if (items.length === 0) {
    return { valid: false, error: 'At least one item is required' };
  }

  if (order.status !== OrderStatus.DELIVERED) {
    return { valid: false, error: 'Order must be delivered to request a return' };
  }

  const orderDate = new Date(order.deliveredAt ?? order.createdAt);
  if (new Date() > calculateReturnDeadline(orderDate, returnWindowDays)) {
    return {
      valid: false,
      error: `Return window has expired. Must return within ${returnWindowDays} days of delivery.`,
    };
  }

  for (const item of items) {
    const orderItem = order.items.find((entry) => entry.productId === item.productId);
    if (!orderItem) {
      return { valid: false, error: `Product ${item.productId} not found in order` };
    }

    if (item.quantity > orderItem.quantity) {
      return { valid: false, error: `Invalid quantity for product ${item.productId}` };
    }
  }

  return { valid: true, error: null };
}

export function validateReturnReason(reason: ReturnReason, category?: string): boolean {
  if (!Object.values(ReturnReasonCode).includes(reason as ReturnReasonCode)) {
    return false;
  }

  return !(category === 'final_sale' && reason === ReturnReasonCode.CHANGED_MIND);
}
