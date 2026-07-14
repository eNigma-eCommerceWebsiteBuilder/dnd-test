import { apiRequest } from '../../core/client';
import type { ApiRequestOptions, Cart } from '../../types';

export async function getCart(options: ApiRequestOptions = {}): Promise<Cart> {
  return apiRequest<Cart>('/cart', {
    cache: 'no-store',
    ...options,
  });
}

export async function getCartCount(
  options: ApiRequestOptions = {},
): Promise<{ totalItems: number }> {
  return apiRequest<{ totalItems: number }>('/cart/count', {
    cache: 'no-store',
    ...options,
  });
}
