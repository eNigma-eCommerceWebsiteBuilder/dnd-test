import type { Address } from './orders';
export type { Address };

export enum PaymentMethodId {
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
  APPLE_PAY = 'apple_pay',
  GOOGLE_PAY = 'google_pay',
  BANK_TRANSFER = 'bank_transfer',
  CASH_ON_DELIVERY = 'cash_on_delivery',
}

export enum PaymentProcessingStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  REQUIRES_ACTION = 'requires_action',
}

export interface PaymentMethod {
  id: PaymentMethodId;
  name: string;
  enabled: boolean;
  description?: string;
  provider?: string;
  fees?: string;
  processingTime?: string;
  icon?: string;
}

export interface StripeConfig {
  publishableKey: string;
  mode: 'test' | 'live' | 'simulator';
}

export interface PaymentIntent {
  paymentId: string;
  clientSecret: string;
  providerPaymentId: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethodId;
  status: PaymentProcessingStatus | string;
  approvalUrl: string | null;
}

export interface PaymentConfirmation {
  paymentId: string;
  status: PaymentProcessingStatus.SUCCEEDED | PaymentProcessingStatus.FAILED | PaymentProcessingStatus.PENDING;
  transactionId?: string;
  receiptUrl?: string;
  paidAt?: string;
  failureReason?: string;
}

export interface PaymentStatus {
  paymentId: string;
  orderId: string;
  orderNumber: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethodId;
  status: PaymentProcessingStatus | string;
  transactionId?: string;
  receiptUrl?: string;
  paidAt?: string;
  createdAt: string;
}

export interface PaymentCreateData {
  paymentMethod: PaymentMethodId;
  billingAddress: Address;
  email?: string;
}

export interface PaymentConfirmData {
  paymentMethodId?: string;
  email?: string;
}

export interface RefundRequest {
  success: boolean;
  message: string;
}
