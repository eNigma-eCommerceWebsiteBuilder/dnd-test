import type { OrderItem } from '@/lib/api/types/orders';

export interface RefundCalculation {
  subtotal: number;
  shipping: number;
  restocking: number;
  tax: number;
  total: number;
  breakdown: {
    itemsRefund: number;
    shippingRefund: number;
    restockingFee: number;
    taxRefund: number;
  };
}

export function calculateRefundAmount(
  items: Array<Pick<OrderItem, 'price' | 'quantity'> & { tax?: number }>,
  shippingCost: number = 0,
  restockingFeePercent: number = 0,
  includeShipping: boolean = true,
): RefundCalculation {
  const itemsRefund = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxRefund = items.reduce((sum, item) => sum + (item.tax ?? 0) * item.quantity, 0);
  const restockingFee = (itemsRefund * restockingFeePercent) / 100;
  const shippingRefund = includeShipping ? shippingCost : 0;
  const subtotal = itemsRefund + shippingRefund + taxRefund;
  const total = subtotal - restockingFee;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    shipping: Math.round(shippingRefund * 100) / 100,
    restocking: Math.round(restockingFee * 100) / 100,
    tax: Math.round(taxRefund * 100) / 100,
    total: Math.round(total * 100) / 100,
    breakdown: {
      itemsRefund: Math.round(itemsRefund * 100) / 100,
      shippingRefund: Math.round(shippingRefund * 100) / 100,
      restockingFee: Math.round(restockingFee * 100) / 100,
      taxRefund: Math.round(taxRefund * 100) / 100,
    },
  };
}

export function calculateReturnDeadline(
  orderDate: Date | string,
  returnWindowDays: number = 30,
): Date {
  const normalizedDate = typeof orderDate === 'string' ? new Date(orderDate) : orderDate;
  const deadline = new Date(normalizedDate);
  deadline.setDate(deadline.getDate() + returnWindowDays);
  return deadline;
}

export function calculateExchangePriceDifference(
  returnItems: Array<Pick<OrderItem, 'price' | 'quantity'>>,
  exchangeItems: Array<Pick<OrderItem, 'price' | 'quantity'>>,
): number {
  const returnTotal = returnItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const exchangeTotal = exchangeItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return Math.round((exchangeTotal - returnTotal) * 100) / 100;
}
