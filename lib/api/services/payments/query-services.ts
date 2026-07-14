import { apiRequest } from '../../core/client';
import type {
  ApiRequestOptions,
  PaymentMethod,
  PaymentStatus,
  StripeConfig,
} from '../../types';
import { validateEmail } from '../../utils/validators';
import { validatePaymentResourceId } from './shared';

export async function getPaymentMethods(
  options: ApiRequestOptions = {},
): Promise<PaymentMethod[]> {
  return apiRequest<PaymentMethod[]>('/payments/methods', {
    revalidate: 300,
    tags: ['payments', 'payment-methods'],
    ...options,
  });
}

export async function getStripeConfig(
  options: ApiRequestOptions = {},
): Promise<StripeConfig> {
  return apiRequest<StripeConfig>('/payments/config', {
    revalidate: 3600,
    tags: ['payments', 'stripe-config'],
    ...options,
  });
}

export async function getPaymentStatus(
  paymentId: string,
  email: string | null = null,
  options: ApiRequestOptions = {},
): Promise<PaymentStatus> {
  validatePaymentResourceId(paymentId);
  if (email) {
    validateEmail(email);
  }

  return apiRequest<PaymentStatus>(`/payments/${paymentId}`, {
    params: email ? { email } : undefined,
    cache: 'no-store',
    ...options,
  });
}

export async function getPaymentReceipt(
  paymentId: string,
  options: ApiRequestOptions = {},
): Promise<PaymentStatus> {
  validatePaymentResourceId(paymentId);

  return apiRequest<PaymentStatus>(`/payments/${paymentId}/receipt`, {
    cache: 'no-store',
    ...options,
  });
}

export async function isPaymentCompleted(
  paymentId: string,
  options: ApiRequestOptions = {},
): Promise<boolean> {
  try {
    const status = await getPaymentStatus(paymentId, null, options);
    return status.status === 'succeeded';
  } catch {
    return false;
  }
}
