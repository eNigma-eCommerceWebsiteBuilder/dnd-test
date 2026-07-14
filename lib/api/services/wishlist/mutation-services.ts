import { apiMutate } from '../../core/client';
import type {
  ApiMutateOptions,
  Wishlist,
  WishlistAddRequest,
  WishlistBulkAddRequest,
  WishlistBulkAddResponse,
  WishlistBulkRemoveRequest,
  WishlistBulkRemoveResponse,
  WishlistMoveAllResponse,
  WishlistMoveToCartRequest,
  WishlistMoveToCartResponse,
  WishlistNotificationToggleRequest,
  WishlistNotificationToggleResponse,
  WishlistNotificationType,
  WishlistResponse,
  WishlistShareResponse,
  WishlistSuccessResponse,
} from '../../types';
import { unwrapResponseData } from '../../utils';
import {
  validateBulkWishlistAddItems,
  validateBulkWishlistRemoveItems,
  validateWishlistMoveQuantity,
  validateWishlistNotificationType,
  validateWishlistProductSelection,
} from './shared';

export async function addToWishlist(
  productId: string,
  variantId?: string,
  options: ApiMutateOptions = {},
): Promise<Wishlist> {
  validateWishlistProductSelection(productId, variantId);

  const body: WishlistAddRequest = {
    productId,
    ...(variantId ? { variantId } : {}),
  };

  return unwrapResponseData(
    await apiMutate<WishlistResponse>('/wishlist/add', {
      method: 'POST',
      body,
      unwrapResponse: false,
      ...options,
    }),
  );
}

export async function removeFromWishlist(
  productId: string,
  variantId?: string,
  options: ApiMutateOptions = {},
): Promise<Wishlist> {
  validateWishlistProductSelection(productId, variantId);

  return unwrapResponseData(
    await apiMutate<WishlistResponse>(`/wishlist/remove/${productId}`, {
      method: 'DELETE',
      body: variantId ? { variantId } : undefined,
      unwrapResponse: false,
      ...options,
    }),
  );
}

export async function clearWishlist(
  options: ApiMutateOptions = {},
): Promise<WishlistSuccessResponse> {
  return apiMutate<WishlistSuccessResponse>('/wishlist/clear', {
    method: 'DELETE',
    ...options,
  });
}

export async function toggleNotification(
  productId: string,
  notificationType: WishlistNotificationType,
  variantId?: string,
  options: ApiMutateOptions = {},
): Promise<WishlistNotificationToggleResponse> {
  validateWishlistProductSelection(productId, variantId);
  validateWishlistNotificationType(notificationType);

  const body: WishlistNotificationToggleRequest = {
    productId,
    notificationType,
    ...(variantId ? { variantId } : {}),
  };

  return apiMutate<WishlistNotificationToggleResponse>('/wishlist/toggle-notification', {
    method: 'PUT',
    body,
    ...options,
  });
}

export async function moveToCart(
  productId: string,
  variantId?: string,
  quantity: number = 1,
  options: ApiMutateOptions = {},
): Promise<WishlistMoveToCartResponse> {
  validateWishlistProductSelection(productId, variantId);
  validateWishlistMoveQuantity(quantity);

  const body: WishlistMoveToCartRequest = {
    quantity,
    ...(variantId ? { variantId } : {}),
  };

  return apiMutate<WishlistMoveToCartResponse>(`/wishlist/move-to-cart/${productId}`, {
    method: 'POST',
    body,
    ...options,
  });
}

export async function addBulkToWishlist(
  items: WishlistBulkAddRequest['items'],
  options: ApiMutateOptions = {},
): Promise<WishlistBulkAddResponse> {
  validateBulkWishlistAddItems(items);

  const body: WishlistBulkAddRequest = { items };

  return apiMutate<WishlistBulkAddResponse>('/wishlist/add-bulk', {
    method: 'POST',
    body,
    ...options,
  });
}

export async function removeBulkFromWishlist(
  items: WishlistBulkRemoveRequest['items'],
  options: ApiMutateOptions = {},
): Promise<WishlistBulkRemoveResponse> {
  validateBulkWishlistRemoveItems(items);

  const body: WishlistBulkRemoveRequest = { items };

  return apiMutate<WishlistBulkRemoveResponse>('/wishlist/remove-bulk', {
    method: 'DELETE',
    body,
    ...options,
  });
}

export async function moveAllToCart(
  options: ApiMutateOptions = {},
): Promise<WishlistMoveAllResponse> {
  return apiMutate<WishlistMoveAllResponse>('/wishlist/move-all-to-cart', {
    method: 'POST',
    ...options,
  });
}

export async function generateShareLink(
  options: ApiMutateOptions = {},
): Promise<WishlistShareResponse> {
  return apiMutate<WishlistShareResponse>('/wishlist/share', {
    method: 'POST',
    unwrapResponse: false,
    ...options,
  });
}
