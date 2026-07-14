import type {
  Wishlist,
  WishlistBulkAddRequest,
  WishlistBulkRemoveRequest,
  WishlistNotificationType,
} from '../../types';
import { ApiError } from '../../core/errors';
import { validateObjectId, validateQuantity } from '../../utils/validators';

export interface WishlistItemSelection {
  productId: string;
  variantId?: string;
}

const MAX_BULK_ITEMS = 50;
const WISHLIST_NOTIFICATION_TYPES = new Set<string>(['priceDrop', 'backInStock']);

export function createEmptyWishlist(): Wishlist {
  return {
    _id: '',
    items: [],
    totalItems: 0,
    lastUpdated: new Date().toISOString(),
  };
}

export function validateWishlistProductSelection(productId: string, variantId?: string): void {
  validateObjectId(productId, 'Product ID');
  if (variantId) {
    validateObjectId(variantId, 'Variant ID');
  }
}

export function validateWishlistNotificationType(notificationType: WishlistNotificationType): void {
  if (!WISHLIST_NOTIFICATION_TYPES.has(notificationType)) {
    throw new ApiError(
      'Invalid notification type. Must be "priceDrop" or "backInStock"',
      400,
      'INVALID_NOTIFICATION_TYPE',
    );
  }
}

function validateWishlistItems(items: WishlistItemSelection[], errorCode: string): void {
  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError('Items array is required and cannot be empty', 400, errorCode);
  }

  items.forEach((item, index) => {
    if (!item.productId) {
      throw new ApiError(
        `Product ID is required for item at index ${index}`,
        400,
        'MISSING_PRODUCT_ID',
      );
    }

    validateWishlistProductSelection(item.productId, item.variantId);
  });
}

export function validateBulkWishlistAddItems(items: WishlistBulkAddRequest['items']): void {
  validateWishlistItems(items, 'MISSING_ITEMS');

  if (items.length > MAX_BULK_ITEMS) {
    throw new ApiError('Maximum 50 items per bulk operation', 400, 'BULK_LIMIT_EXCEEDED');
  }
}

export function validateBulkWishlistRemoveItems(items: WishlistBulkRemoveRequest['items']): void {
  validateWishlistItems(items, 'MISSING_ITEMS');
}

export function validateWishlistMoveQuantity(quantity: number): void {
  validateQuantity(quantity);
}

export function validateShareToken(shareToken: string): string {
  if (!shareToken || typeof shareToken !== 'string' || shareToken.trim().length === 0) {
    throw new ApiError('Share token is required', 400, 'MISSING_SHARE_TOKEN');
  }

  return shareToken.trim();
}
