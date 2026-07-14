'use server';

import { revalidatePath } from 'next/cache';
import {
  confirmPayment as apiConfirmPayment,
  createPaymentIntent as apiCreatePaymentIntent,
  requestRefund as apiRequestRefund,
  type Address,
} from '@/lib/api';
import { PaymentProcessingStatus } from '@/lib/api/types';
import type {
  ActionResult,
  ActionState,
  FieldErrors,
  FormDataOrObject,
  PaymentConfirmationResult,
  PaymentIntentResult,
} from '@/lib/actions/types';
import {
  ACTION_CACHE_TAGS,
  orderCacheTag,
  paymentCacheTag,
  revalidateActionTags,
} from '@/lib/actions/internal/cache';
import {
  createErrorResult,
  createSuccessResult,
} from '@/lib/actions/internal/errors';
import {
  normalizePaymentMethod,
  requiresBillingAddress,
} from '@/lib/actions/internal/payments';
import { getActionRequestContext } from '@/lib/actions/internal/request';
import {
  OrderFieldKey,
  buildAddress,
  getEmailValue,
  getStringValue,
  validateAddressFields,
} from '../orders/shared';

const ACCOUNT_ORDERS_PATH = '/account/orders';
const CART_PATH = '/cart';

function toBillingAddress(address: Partial<Address> | undefined): Address {
  return {
    street: address?.street ?? '',
    city: address?.city ?? '',
    state: address?.state ?? '',
    zipCode: address?.zipCode ?? '',
    country: address?.country ?? '',
  };
}

export async function createPaymentIntentAction(
  prevState: ActionState<PaymentIntentResult>,
  formData: FormDataOrObject<{
    orderId?: string;
    paymentMethod?: string;
    email?: string;
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  }>,
): Promise<PaymentIntentResult> {
  void prevState;

  const orderId = getStringValue(formData, OrderFieldKey.ORDER_ID);
  const paymentMethod = normalizePaymentMethod(getStringValue(formData, OrderFieldKey.PAYMENT_METHOD));
  const billingAddress = buildAddress(formData);
  const fieldErrors: FieldErrors = {};

  if (!orderId) {
    return createErrorResult('Order ID is required.');
  }
  if (!paymentMethod) {
    return createErrorResult('A supported payment method is required.');
  }
  if (requiresBillingAddress(paymentMethod)) {
    validateAddressFields(billingAddress ?? {}, fieldErrors);
  }
  if (Object.keys(fieldErrors).length > 0) {
    return createErrorResult('Please correct the highlighted billing fields.', { fieldErrors });
  }

  try {
    const response = await apiCreatePaymentIntent(
      orderId,
      {
        paymentMethod,
        billingAddress: toBillingAddress(billingAddress),
        email: getEmailValue(formData, OrderFieldKey.EMAIL),
      },
      await getActionRequestContext(),
    );

    revalidateActionTags([ACTION_CACHE_TAGS.orders, orderCacheTag(orderId)]);
    return createSuccessResult(response, { message: 'Payment intent created.' });
  } catch (error: unknown) {
    return createErrorResult(error instanceof Error ? error.message : 'Failed to create payment intent.');
  }
}

export async function confirmPaymentAction(
  prevState: ActionState<PaymentConfirmationResult>,
  formData: FormDataOrObject<{
    paymentId?: string;
    paymentMethodId?: string;
    email?: string;
  }>,
): Promise<PaymentConfirmationResult> {
  void prevState;

  const paymentId = getStringValue(formData, 'paymentId');
  if (!paymentId) {
    return createErrorResult('Payment ID is required.');
  }

  try {
    const response = await apiConfirmPayment(
      paymentId,
      {
        paymentMethodId: getStringValue(formData, 'paymentMethodId'),
        email: getEmailValue(formData, OrderFieldKey.EMAIL),
      },
      await getActionRequestContext(),
    );

    revalidateActionTags([
      ACTION_CACHE_TAGS.cart,
      ACTION_CACHE_TAGS.orders,
      paymentCacheTag(paymentId),
    ]);
    revalidatePath(CART_PATH);

    if (response.status === PaymentProcessingStatus.SUCCEEDED) {
      return createSuccessResult(response, {
        message: 'Payment successful.',
        redirectTo: ACCOUNT_ORDERS_PATH,
      });
    }

    if (response.status === PaymentProcessingStatus.FAILED) {
      return createErrorResult(response.failureReason ?? 'Payment failed.');
    }

    return createErrorResult('Payment is still processing.');
  } catch (error: unknown) {
    return createErrorResult(error instanceof Error ? error.message : 'Failed to confirm payment.');
  }
}

export async function requestRefundAction(
  prevState: ActionState,
  formData: FormDataOrObject<{
    paymentId?: string;
    reason?: string;
    email?: string;
  }>,
): Promise<ActionResult> {
  void prevState;

  const paymentId = getStringValue(formData, 'paymentId');
  const reason = getStringValue(formData, OrderFieldKey.REASON);

  if (!paymentId) {
    return createErrorResult('Payment ID is required.');
  }
  if (!reason || reason.length < 10) {
    return createErrorResult('Refund reason must be at least 10 characters.');
  }

  try {
    await apiRequestRefund(
      paymentId,
      reason,
      getEmailValue(formData, OrderFieldKey.EMAIL) ?? null,
      await getActionRequestContext(),
    );

    revalidateActionTags([
      ACTION_CACHE_TAGS.orders,
      ACTION_CACHE_TAGS.payments,
      paymentCacheTag(paymentId),
    ]);
    revalidatePath(ACCOUNT_ORDERS_PATH);

    return {
      success: true,
      message: 'Refund request submitted successfully. We will review it shortly.',
    };
  } catch (error: unknown) {
    return createErrorResult(error instanceof Error ? error.message : 'Failed to submit refund request.');
  }
}
