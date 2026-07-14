import { apiMutate } from '../../core/client';
import type {
  ApiMutateOptions,
  PaymentConfirmData,
  PaymentConfirmation,
  PaymentCreateData,
  PaymentIntent,
  RefundRequest,
} from '../../types';
import {
  validatePaymentConfirmData,
  validatePaymentCreateData,
  validateRefundRequest,
} from './shared';

export async function createPaymentIntent(
  orderId: string,
  paymentData: PaymentCreateData,
  options: ApiMutateOptions = {},
): Promise<PaymentIntent> {
  validatePaymentCreateData(orderId, paymentData);

  return apiMutate<PaymentIntent>('/payments/create-intent', {
    method: 'POST',
    body: {
      orderId,
      ...paymentData,
    },
    ...options,
  });
}

export async function confirmPayment(
  paymentId: string,
  confirmData: PaymentConfirmData = {},
  options: ApiMutateOptions = {},
): Promise<PaymentConfirmation> {
  validatePaymentConfirmData(paymentId, confirmData);

  return apiMutate<PaymentConfirmation>('/payments/confirm', {
    method: 'POST',
    body: {
      paymentId,
      ...confirmData,
    },
    ...options,
  });
}

export async function requestRefund(
  paymentId: string,
  reason: string,
  email: string | null = null,
  options: ApiMutateOptions = {},
): Promise<RefundRequest> {
  validateRefundRequest(paymentId, reason, email);

  return apiMutate<RefundRequest>(`/payments/${paymentId}/refund-request`, {
    method: 'POST',
    body: {
      reason: reason.trim(),
      ...(email ? { email } : {}),
    },
    ...options,
  });
}
