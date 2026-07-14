import type {
  PaymentConfirmData,
  PaymentCreateData,
} from '../../types';
import { ApiError } from '../../core/errors';
import { validateEmail, validateObjectId, validatePaymentMethod } from '../../utils/validators';

export function validatePaymentResourceId(paymentId: string, fieldName: string = 'Payment ID'): void {
  if (!paymentId || typeof paymentId !== 'string') {
    throw new ApiError(`${fieldName} is required`, 400, 'MISSING_PAYMENT_ID');
  }
}

export function validatePaymentCreateData(orderId: string, paymentData: PaymentCreateData): void {
  validateObjectId(orderId, 'Order ID');

  if (!paymentData || typeof paymentData !== 'object') {
    throw new ApiError('Payment data is required', 400, 'MISSING_PAYMENT_DATA');
  }

  if (!paymentData.paymentMethod) {
    throw new ApiError('Payment method is required', 400, 'MISSING_PAYMENT_METHOD');
  }

  validatePaymentMethod(paymentData.paymentMethod);

  if (paymentData.email) {
    validateEmail(paymentData.email);
  }
}

export function validatePaymentConfirmData(
  paymentId: string,
  confirmData: PaymentConfirmData,
): void {
  validatePaymentResourceId(paymentId);

  if (paymentId.length === 24 && /^[0-9a-fA-F]{24}$/.test(paymentId)) {
    validateObjectId(paymentId, 'Payment ID');
  }

  if (confirmData.email) {
    validateEmail(confirmData.email);
  }
}

export function validateRefundRequest(
  paymentId: string,
  reason: string,
  email: string | null,
): void {
  validatePaymentResourceId(paymentId);

  if (!reason || typeof reason !== 'string' || reason.trim().length === 0) {
    throw new ApiError('Refund reason is required', 400, 'MISSING_REASON');
  }

  if (reason.length > 500) {
    throw new ApiError('Refund reason is too long (max 500 characters)', 400, 'REASON_TOO_LONG');
  }

  if (email) {
    validateEmail(email);
  }
}
