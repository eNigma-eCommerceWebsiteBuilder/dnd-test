'use server';

import {
  createExchangePaymentIntent as apiCreateExchangePaymentIntent,
  requestExchange as apiRequestExchange,
  type Address,
  type ExchangeItem,
  type ExchangePaymentIntentResponse,
} from '@/lib/api';
import type {
  ActionResult,
  ActionState,
  ExchangeActionResult,
  FormDataOrObject,
} from '@/lib/actions/types';
import {
  ACTION_CACHE_TAGS,
  orderCacheTag,
  revalidateActionTags,
} from '@/lib/actions/internal/cache';
import {
  createErrorResult,
  createSuccessResult,
} from '@/lib/actions/internal/errors';
import { normalizePaymentMethod } from '@/lib/actions/internal/payments';
import { getActionRequestContext } from '@/lib/actions/internal/request';
import {
  OrderFieldKey,
  getEmailValue,
  getExchangeItems,
  getStringValue,
  parseJsonValue,
} from './shared';

const ACCOUNT_ORDERS_PATH = '/account/orders';

export async function requestExchangeAction(
  prevState: ActionState<ExchangeActionResult>,
  formData: FormDataOrObject<{
    orderId?: string;
    itemsReturned?: ExchangeItem[] | string;
    itemsRequested?: ExchangeItem[] | string;
    email?: string;
    reason?: string;
  }>,
): Promise<ExchangeActionResult> {
  void prevState;

  const orderId = getStringValue(formData, OrderFieldKey.ORDER_ID);
  const itemsReturned = getExchangeItems(formData, 'itemsReturned') ?? [];
  const itemsRequested = getExchangeItems(formData, 'itemsRequested') ?? [];

  if (!orderId) {
    return createErrorResult('Order ID is required.');
  }
  if (itemsReturned.length === 0 || itemsRequested.length === 0) {
    return createErrorResult('Both returned and requested items are required.');
  }

  try {
    const response = await apiRequestExchange(
      orderId,
      {
        itemsReturned,
        itemsRequested,
        email: getEmailValue(formData, OrderFieldKey.EMAIL),
        reason: getStringValue(formData, OrderFieldKey.REASON),
      },
      await getActionRequestContext(),
    );

    revalidateActionTags([ACTION_CACHE_TAGS.orders, orderCacheTag(orderId)]);

    return createSuccessResult(response, {
      message:
        response.message ??
        (response.data.priceDifference && response.data.priceDifference > 0
          ? `Exchange requested. Additional payment of $${response.data.priceDifference.toFixed(2)} required.`
          : 'Exchange requested successfully.'),
      redirectTo: ACCOUNT_ORDERS_PATH,
    });
  } catch (error: unknown) {
    return createErrorResult(error instanceof Error ? error.message : 'Failed to request exchange.');
  }
}

export async function createExchangePaymentAction(
  prevState: ActionState,
  formData: FormDataOrObject<{
    orderId?: string;
    exchangeId?: string;
    paymentMethod?: string;
    billingAddress?: Address | string;
    email?: string;
  }>,
): Promise<ActionResult<ExchangePaymentIntentResponse>> {
  void prevState;

  const orderId = getStringValue(formData, OrderFieldKey.ORDER_ID);
  const exchangeId = getStringValue(formData, OrderFieldKey.EXCHANGE_ID);
  const paymentMethod = normalizePaymentMethod(getStringValue(formData, OrderFieldKey.PAYMENT_METHOD));
  const billingAddress = parseJsonValue<Address, {
    orderId?: string;
    exchangeId?: string;
    paymentMethod?: string;
    billingAddress?: Address | string;
    email?: string;
  }>(formData, OrderFieldKey.BILLING_ADDRESS);
  const email = getEmailValue(formData, OrderFieldKey.EMAIL);

  if (!orderId || !exchangeId || !paymentMethod || !billingAddress || !email) {
    return createErrorResult('Order, exchange, payment, billing, and email details are required.');
  }

  try {
    const response = await apiCreateExchangePaymentIntent(
      orderId,
      exchangeId,
      { paymentMethod, billingAddress, email },
      await getActionRequestContext(),
    );

    return createSuccessResult(response, { message: 'Payment intent created.' });
  } catch (error: unknown) {
    return createErrorResult(error instanceof Error ? error.message : 'Failed to create payment intent.');
  }
}
