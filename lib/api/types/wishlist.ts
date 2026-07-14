import type { Cart } from './cart';
import type { Product } from './products';

export enum WishlistNotificationType {
  PRICE_DROP = 'priceDrop',
  BACK_IN_STOCK = 'backInStock',
}

export interface ProductSnapshot {
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  sku?: string;
  inStock: boolean;
  variantLabel?: string;
}

export interface WishlistItem {
  _id: string;
  product: Product;
  productId: string;
  variantId?: string;
  priceWhenAdded: number;
  notifyOnPriceDrop: boolean;
  notifyOnBackInStock: boolean;
  productSnapshot: ProductSnapshot;
  addedAt: string;
}

export interface Wishlist {
  _id: string;
  items: WishlistItem[];
  totalItems: number;
  shareToken?: string;
  lastUpdated: string;
  userId?: string;
  guestId?: string;
  expiresAt?: string;
}

export interface WishlistMoveToCartResult {
  cart: Cart;
  wishlist: Wishlist;
}

export interface WishlistItemReference {
  productId: string;
  variantId?: string;
}

export type WishlistAddRequest = WishlistItemReference;

export interface WishlistBulkAddRequest {
  items: WishlistItemReference[];
}

export interface WishlistBulkRemoveRequest {
  items: WishlistItemReference[];
}

export interface WishlistNotificationToggleRequest extends WishlistItemReference {
  notificationType: WishlistNotificationType;
}

export interface WishlistMoveToCartRequest {
  variantId?: string;
  quantity?: number;
}

export interface WishlistBulkOperationResult extends WishlistItemReference {
  name: string;
}

export interface WishlistBulkOperationFailure extends WishlistItemReference {
  reason: string;
}

export interface WishlistBulkOperationError extends WishlistItemReference {
  error: string;
}

export interface WishlistBulkAddResponse {
  success: boolean;
  data: {
    added: WishlistBulkOperationResult[];
    skipped: WishlistBulkOperationFailure[];
    errors: WishlistBulkOperationError[];
  };
  message: string;
}

export interface WishlistNotificationToggleResponse {
  success: boolean;
  data: {
    productId: string;
    variantId?: string;
    notifyOnPriceDrop?: boolean;
    notifyOnBackInStock?: boolean;
  };
  message: string;
}

export interface WishlistMoveToCartResponse {
  success: boolean;
  message: string;
  data: WishlistMoveToCartResult;
}

export interface WishlistMoveAllResponse {
  success: boolean;
  data: {
    moved: WishlistBulkOperationResult[];
    skipped: WishlistBulkOperationFailure[];
    errors: WishlistBulkOperationError[];
  };
  message: string;
}

export interface WishlistBulkRemoveResponse {
  success: boolean;
  message: string;
  data: {
    removedCount: number;
    remainingItems: number;
  };
}

export interface WishlistShareResponse {
  success: boolean;
  data: {
    shareToken: string;
    shareUrl: string;
  };
  message: string;
}

export interface WishlistCheckResponse {
  success: boolean;
  data: {
    inWishlist: boolean;
  };
}

export interface WishlistCountResponse {
  success: boolean;
  data: {
    count: number;
  };
}

export interface WishlistResponse {
  success: boolean;
  data: Wishlist;
  message?: string;
}

export interface WishlistSuccessResponse {
  success: boolean;
  message: string;
  data?: unknown;
}
