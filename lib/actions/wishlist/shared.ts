import type { Cart, Wishlist } from '@/lib/api';
import { createErrorResult } from '@/lib/actions/internal/errors';
import type {
  ActionResult,
  WishlistActionResult,
  WishlistBulkResult,
} from '@/lib/actions/types';

export enum WishlistFieldKey {
  PRODUCT_ID = 'productId',
  VARIANT_ID = 'variantId',
  SHARE_TOKEN = 'shareToken',
  TYPE = 'type',
  QUANTITY = 'quantity',
  ITEMS = 'items',
}

export const WISHLIST_STUB_MESSAGES = {
  notification:
    'Wishlist notifications depend on a backend endpoint that is documented as STUB and is not treated as production-ready in this refactor.',
  moveToCart:
    'Moving wishlist items to cart depends on a backend endpoint that is documented as STUB and is not treated as production-ready in this refactor.',
  bulkAdd:
    'Bulk wishlist add depends on a backend endpoint that is documented as STUB and is not treated as production-ready in this refactor.',
  bulkRemove:
    'Bulk wishlist remove depends on a backend endpoint that is documented as STUB and is not treated as production-ready in this refactor.',
  moveAllToCart:
    'Moving the entire wishlist to cart depends on a backend endpoint that is documented as STUB and is not treated as production-ready in this refactor.',
} as const;

export function createEmptyWishlist(): Wishlist {
  return {
    _id: '',
    items: [],
    totalItems: 0,
    lastUpdated: new Date().toISOString(),
  };
}

export function withWishlistCompatibility(
  result: ActionResult<Wishlist>,
  wishlist: Wishlist,
  cart?: Cart,
): WishlistActionResult {
  return {
    ...result,
    wishlist,
    itemCount: wishlist.totalItems,
    ...(cart ? { cart } : {}),
  };
}

export function createUnsupportedWishlistResult(message: string): WishlistBulkResult {
  return {
    ...createErrorResult(message),
    added: 0,
    failed: 0,
    errors: [],
  };
}
