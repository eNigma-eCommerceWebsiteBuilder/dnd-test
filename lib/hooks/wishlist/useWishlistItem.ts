'use client';

import type { WishlistActionResult } from '@/lib/actions/types';
import type { WishlistNotificationType } from '@/lib/api/types/wishlist';
import { useWishlistStore } from '@/lib/stores/wishlist-store';
import type { UseWishlistItemReturn } from './types';

export function useWishlistItem(): UseWishlistItemReturn {
  const loading = useWishlistStore((state) => state.isPending || state.loading);
  const error = useWishlistStore((state) => state.error);
  const ensureWishlistLoaded = useWishlistStore((state) => state.ensureWishlistLoaded);
  const moveToCartStore = useWishlistStore((state) => state.moveToCart);
  const toggleNotificationStore = useWishlistStore((state) => state.toggleNotification);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist);
  const clearError = useWishlistStore((state) => state.clearError);

  return {
    loading,
    error,
    toggleNotification: async (productId: string, type: WishlistNotificationType, variantId?: string): Promise<WishlistActionResult> => {
      clearError();
      await toggleNotificationStore(productId, type, variantId);
      return { success: true, message: 'Notification preference updated' };
    },
    moveToCart: async (productId: string, variantId?: string, quantity: number = 1): Promise<WishlistActionResult> => {
      clearError();
      await moveToCartStore(productId, variantId, quantity);
      return { success: true, message: 'Moved to cart' };
    },
    checkProductStatus: async (productId: string, variantId?: string): Promise<boolean> => {
      await ensureWishlistLoaded();
      return isInWishlist(productId, variantId);
    },
  };
}
