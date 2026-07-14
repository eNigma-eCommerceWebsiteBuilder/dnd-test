import { OrderStatus, type OrderStatusValue } from '@/lib/api/types/orders';
import {
  PaymentProcessingStatus,
  type PaymentMethodId,
} from '@/lib/api/types/payments';

export const ORDER_STATUS = OrderStatus;
export type { OrderStatusValue as OrderStatus };

export const ORDER_STATUS_LABELS: Record<OrderStatusValue, string> = {
  [OrderStatus.PENDING]: 'Pending',
  [OrderStatus.PROCESSING]: 'Processing',
  [OrderStatus.SHIPPED]: 'Shipped',
  [OrderStatus.DELIVERED]: 'Delivered',
  [OrderStatus.CANCELLED]: 'Cancelled',
  [OrderStatus.REFUND_REQUESTED]: 'Refund Requested',
  [OrderStatus.EXCHANGE_REQUESTED]: 'Exchange Requested',
};

export const ORDER_STATUS_COLORS: Record<OrderStatusValue, string> = {
  [OrderStatus.PENDING]: 'text-yellow-600 bg-yellow-50',
  [OrderStatus.PROCESSING]: 'text-blue-600 bg-blue-50',
  [OrderStatus.SHIPPED]: 'text-purple-600 bg-purple-50',
  [OrderStatus.DELIVERED]: 'text-green-600 bg-green-50',
  [OrderStatus.CANCELLED]: 'text-red-600 bg-red-50',
  [OrderStatus.REFUND_REQUESTED]: 'text-orange-600 bg-orange-50',
  [OrderStatus.EXCHANGE_REQUESTED]: 'text-cyan-600 bg-cyan-50',
};

export const PAYMENT_STATUS = PaymentProcessingStatus;
export type PaymentStatus = `${PaymentProcessingStatus}`;

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  [PaymentProcessingStatus.PENDING]: 'Pending',
  [PaymentProcessingStatus.PROCESSING]: 'Processing',
  [PaymentProcessingStatus.SUCCEEDED]: 'Completed',
  [PaymentProcessingStatus.FAILED]: 'Failed',
  [PaymentProcessingStatus.CANCELLED]: 'Cancelled',
  [PaymentProcessingStatus.REFUNDED]: 'Refunded',
  [PaymentProcessingStatus.REQUIRES_ACTION]: 'Action Required',
};

export const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  [PaymentProcessingStatus.PENDING]: 'text-yellow-600 bg-yellow-50',
  [PaymentProcessingStatus.PROCESSING]: 'text-blue-600 bg-blue-50',
  [PaymentProcessingStatus.SUCCEEDED]: 'text-green-600 bg-green-50',
  [PaymentProcessingStatus.FAILED]: 'text-red-600 bg-red-50',
  [PaymentProcessingStatus.CANCELLED]: 'text-gray-600 bg-gray-50',
  [PaymentProcessingStatus.REFUNDED]: 'text-purple-600 bg-purple-50',
  [PaymentProcessingStatus.REQUIRES_ACTION]: 'text-orange-600 bg-orange-50',
};

export enum ShippingStatusCode {
  NOT_SHIPPED = 'not_shipped',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  IN_TRANSIT = 'in_transit',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  FAILED_DELIVERY = 'failed_delivery',
  RETURNED = 'returned',
}

export type ShippingStatus = `${ShippingStatusCode}`;
export const SHIPPING_STATUS = ShippingStatusCode;

export const SHIPPING_STATUS_LABELS: Record<ShippingStatus, string> = {
  [ShippingStatusCode.NOT_SHIPPED]: 'Not Shipped',
  [ShippingStatusCode.PROCESSING]: 'Processing',
  [ShippingStatusCode.SHIPPED]: 'Shipped',
  [ShippingStatusCode.IN_TRANSIT]: 'In Transit',
  [ShippingStatusCode.OUT_FOR_DELIVERY]: 'Out for Delivery',
  [ShippingStatusCode.DELIVERED]: 'Delivered',
  [ShippingStatusCode.FAILED_DELIVERY]: 'Delivery Failed',
  [ShippingStatusCode.RETURNED]: 'Returned',
};

export type PaymentMethod = `${PaymentMethodId}`;
