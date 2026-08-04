'use client';

import { WishlistNotificationType } from '@/lib/api/types/wishlist';
import { useWishlistStore } from '@/lib/stores/wishlist-store';
import type { UseWishlistNotificationsReturn } from './types';

export function useWishlistNotifications(): UseWishlistNotificationsReturn {
  const wishlist = useWishlistStore((state) => state.wishlist);
  const loading = useWishlistStore((state) => state.loading || state.isPending);
  const error = useWishlistStore((state) => state.error);
  const refreshWishlist = useWishlistStore((state) => state.refreshWishlist);
  const toggleNotification = useWishlistStore((state) => state.toggleNotification);
  const getNotificationSettings = useWishlistStore((state) => state.getNotificationSettings);
  return {
    notifications: new Map((wishlist?.items ?? []).map((item) => [`${item.productId}${item.variantId ? `-${item.variantId}` : ''}`, { notifyOnPriceDrop: item.notifyOnPriceDrop, notifyOnBackInStock: item.notifyOnBackInStock }])),
    loading,
    error,
    enablePriceDropAlert: async (productId, variantId) => { await toggleNotification(productId, WishlistNotificationType.PRICE_DROP, variantId); },
    enableStockAlert: async (productId, variantId) => { await toggleNotification(productId, WishlistNotificationType.BACK_IN_STOCK, variantId); },
    disableNotifications: async (productId, variantId) => {
      const settings = getNotificationSettings(productId, variantId);
      if (settings?.notifyOnPriceDrop) await toggleNotification(productId, WishlistNotificationType.PRICE_DROP, variantId);
      if (settings?.notifyOnBackInStock) await toggleNotification(productId, WishlistNotificationType.BACK_IN_STOCK, variantId);
    },
    getNotificationSettings,
    refreshNotifications: () => { void refreshWishlist(); },
  };
}
