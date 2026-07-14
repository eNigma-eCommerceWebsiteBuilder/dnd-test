import { apiRequest } from '../../core/client';
import type { ApiRequestOptions, DigitalAssetsResponse, Order, PaginatedOrders } from '../../types';
import { validateObjectId } from '../../utils/validators';
import { normalizeOrder, normalizePaginatedOrders } from './normalizers';
import { type GetMyOrdersParams, validateGuestEmail, validateOrderPagination } from './shared';

export async function getOrder(
  id: string,
  options: ApiRequestOptions = {},
): Promise<Order> {
  validateObjectId(id, 'Order ID');

  return normalizeOrder(
    await apiRequest<Order>(`/orders/${id}`, {
      cache: 'no-store',
      ...options,
    }),
  );
}

export async function getMyOrders(
  params: GetMyOrdersParams = {},
  options: ApiRequestOptions = {},
): Promise<PaginatedOrders> {
  validateOrderPagination(params);

  return normalizePaginatedOrders(
    await apiRequest<PaginatedOrders>('/orders/my-orders', {
      params: {
        ...(params.page !== undefined ? { page: params.page } : {}),
        ...(params.limit !== undefined ? { limit: params.limit } : {}),
        ...(params.status ? { status: params.status } : {}),
      },
      cache: 'no-store',
      unwrapResponse: false,
      ...options,
    }),
  );
}

export async function getOrderDigitalAssets(
  orderId: string,
  email: string | null = null,
  options: ApiRequestOptions = {},
): Promise<DigitalAssetsResponse> {
  validateObjectId(orderId, 'Order ID');
  validateGuestEmail(email);

  return apiRequest<DigitalAssetsResponse>(`/orders/${orderId}/digital-assets`, {
    params: email ? { email } : undefined,
    cache: 'no-store',
    ...options,
  });
}
