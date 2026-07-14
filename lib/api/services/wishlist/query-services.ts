import { apiRequest } from '../../core/client';
import type { ApiRequestOptions, Wishlist, WishlistCheckResponse, WishlistCountResponse, WishlistResponse } from '../../types';
import { ApiError } from '../../core/errors';
import { unwrapResponseData } from '../../utils';
import { createEmptyWishlist, validateShareToken, validateWishlistProductSelection } from './shared';

export async function getWishlist(options: ApiRequestOptions = {}): Promise<Wishlist> {
  try {
    return unwrapResponseData(
      await apiRequest<WishlistResponse>('/wishlist', {
        cache: 'no-store',
        unwrapResponse: false,
        ...options,
      }),
    );
  } catch (error: unknown) {
    if (error instanceof ApiError && error.status === 404) {
      return createEmptyWishlist();
    }
    throw error;
  }
}

export async function viewSharedWishlist(
  shareToken: string,
  options: ApiRequestOptions = {},
): Promise<Wishlist> {
  const sanitizedToken = validateShareToken(shareToken);

  return unwrapResponseData(
    await apiRequest<WishlistResponse>(`/wishlist/shared/${sanitizedToken}`, {
      cache: 'no-store',
      unwrapResponse: false,
      ...options,
    }),
  );
}

export async function checkProductInWishlist(
  productId: string,
  variantId?: string,
  options: ApiRequestOptions = {},
): Promise<WishlistCheckResponse> {
  validateWishlistProductSelection(productId, variantId);

  return apiRequest<WishlistCheckResponse>(`/wishlist/check/${productId}`, {
    cache: 'no-store',
    params: variantId ? { variantId } : undefined,
    unwrapResponse: false,
    ...options,
  });
}

export async function getWishlistCount(
  options: ApiRequestOptions = {},
): Promise<WishlistCountResponse> {
  return apiRequest<WishlistCountResponse>('/wishlist/count', {
    cache: 'no-store',
    unwrapResponse: false,
    ...options,
  });
}
