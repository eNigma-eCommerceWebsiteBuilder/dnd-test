'use client';

import { WishlistNotificationType } from '@/lib/api/types/wishlist';
import { getWishlistItemKey } from '@/lib/utils/wishlist';
import type {
  Wishlist,
  WishlistItem,
} from '@/lib/api/types/wishlist';
import type {
  NotificationSettings,
  WishlistSnapshot,
  WishlistStoreState,
} from './types';

export function createWishlistSnapshot(wishlist: Wishlist | null): WishlistSnapshot {
  return {
    wishlist,
    totalItems: wishlist?.totalItems ?? 0,
    loaded: true,
  };
}

export function updateWishlistItems(
  wishlist: Wishlist,
  updater: (item: WishlistItem) => WishlistItem,
): Wishlist {
  return {
    ...wishlist,
    items: wishlist.items.map(updater),
  };
}

export function removeWishlistItem(
  wishlist: Wishlist | null,
  productId: string,
  variantId?: string,
): Wishlist | null {
  if (!wishlist) {
    return null;
  }

  const itemKey = getWishlistItemKey(productId, variantId);
  const items = wishlist.items.filter(
    (item) => getWishlistItemKey(item.productId, item.variantId) !== itemKey,
  );

  return {
    ...wishlist,
    items,
    totalItems: items.length,
  };
}

export function toggleWishlistNotificationState(
  wishlist: Wishlist | null,
  productId: string,
  type: WishlistNotificationType,
  variantId?: string,
): Wishlist | null {
  if (!wishlist) {
    return null;
  }

  const itemKey = getWishlistItemKey(productId, variantId);

  return updateWishlistItems(wishlist, (item) => {
    if (getWishlistItemKey(item.productId, item.variantId) !== itemKey) {
      return item;
    }

    return {
      ...item,
      notifyOnPriceDrop:
        type === WishlistNotificationType.PRICE_DROP
          ? !item.notifyOnPriceDrop
          : item.notifyOnPriceDrop,
      notifyOnBackInStock:
        type === WishlistNotificationType.BACK_IN_STOCK
          ? !item.notifyOnBackInStock
          : item.notifyOnBackInStock,
    };
  });
}

export function isWishlistItemSelected(
  state: Pick<WishlistStoreState, 'wishlist'>,
  productId: string,
  variantId?: string,
): boolean {
  return (
    state.wishlist?.items.some(
      (item) =>
        getWishlistItemKey(item.productId, item.variantId) ===
        getWishlistItemKey(productId, variantId),
    ) ?? false
  );
}

export function getWishlistNotificationSettings(
  state: Pick<WishlistStoreState, 'wishlist'>,
  productId: string,
  variantId?: string,
): NotificationSettings | null {
  const item = state.wishlist?.items.find(
    (entry) =>
      getWishlistItemKey(entry.productId, entry.variantId) ===
      getWishlistItemKey(productId, variantId),
  );

  if (!item) {
    return null;
  }

  return {
    notifyOnPriceDrop: item.notifyOnPriceDrop,
    notifyOnBackInStock: item.notifyOnBackInStock,
  };
}
