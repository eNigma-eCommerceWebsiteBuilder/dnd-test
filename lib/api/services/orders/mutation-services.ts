import { apiMutate } from '../../core/client';
import type {
  ApiMutateOptions,
  ExchangePaymentIntentRequest,
  ExchangePaymentIntentResponse,
  ExchangeRequestData,
  ExchangeRequestResponse,
  Order,
  OrderCreateData,
  OrderCreationResponse,
  OrderUpdateData,
} from '../../types';
import { validateObjectId } from '../../utils/validators';
import {
  normalizeCreateOrderResponse,
  normalizeOrderCreateData,
} from './normalizers';
import {
  validateExchangePaymentIntentData,
  validateExchangeRequestData,
  validateGuestEmail,
  validateOrderUpdateData,
} from './shared';

export async function createOrder(
  orderData: OrderCreateData,
  options: ApiMutateOptions = {},
): Promise<{ order: Order; payment?: OrderCreationResponse['payment'] }> {
  return normalizeCreateOrderResponse(
    await apiMutate<OrderCreationResponse>('/orders', {
      method: 'POST',
      body: normalizeOrderCreateData(orderData),
      unwrapResponse: false,
      ...options,
    }),
  );
}

export async function cancelOrder(
  orderId: string,
  email: string | null = null,
  options: ApiMutateOptions = {},
): Promise<{ success: boolean; message: string }> {
  validateObjectId(orderId, 'Order ID');
  validateGuestEmail(email);

  return apiMutate<{ success: boolean; message: string }>(`/orders/${orderId}/cancel`, {
    method: 'POST',
    body: email ? { email } : {},
    ...options,
  });
}

export async function requestExchange(
  orderId: string,
  exchangeData: ExchangeRequestData,
  options: ApiMutateOptions = {},
): Promise<ExchangeRequestResponse> {
  validateObjectId(orderId, 'Order ID');
  validateExchangeRequestData(exchangeData);

  return apiMutate<ExchangeRequestResponse>(`/orders/${orderId}/exchange-request`, {
    method: 'POST',
    body: exchangeData,
    unwrapResponse: false,
    ...options,
  });
}

export async function createExchangePaymentIntent(
  orderId: string,
  exchangeId: string,
  data: ExchangePaymentIntentRequest,
  options: ApiMutateOptions = {},
): Promise<ExchangePaymentIntentResponse> {
  validateObjectId(orderId, 'Order ID');
  validateObjectId(exchangeId, 'Exchange ID');
  validateExchangePaymentIntentData(data);

  return apiMutate<ExchangePaymentIntentResponse>(`/orders/${orderId}/exchange/${exchangeId}/payment`, {
    method: 'POST',
    body: data,
    unwrapResponse: false,
    ...options,
  });
}

export async function updateOrder(
  orderId: string,
  updateData: OrderUpdateData,
  options: ApiMutateOptions = {},
): Promise<{ success: boolean; message: string }> {
  validateObjectId(orderId, 'Order ID');
  validateOrderUpdateData(updateData);

  return apiMutate<{ success: boolean; message: string }>(`/orders/${orderId}`, {
    method: 'PUT',
    body: updateData,
    ...options,
  });
}
