'use client';

import { create } from 'zustand';
import { useCartStore } from '../cart-store';
import { OverlayId, useOverlayStore } from '../overlay-store';
import {
  createWishlistSnapshot,
  getWishlistNotificationSettings,
  isWishlistItemSelected,
} from './helpers';
import { createWishlistCommands } from './commands';
import type { WishlistStoreState } from './types';

export const useWishlistStore = create<WishlistStoreState>((set, get) => ({
  wishlist: null,
  totalItems: 0,
  loading: false,
  isPending: false,
  error: null,
  loaded: false,

  hydrateWishlist: (wishlist) => {
    set({
      ...createWishlistSnapshot(wishlist),
      loading: false,
      error: null,
    });
  },

  ...createWishlistCommands({
    getState: get,
    setState: set,
    hydrateCart: (cart) => useCartStore.getState().hydrateCart(cart),
    refreshCart: () => useCartStore.getState().refreshCart(),
    openMiniCart: () => useOverlayStore.getState().openOverlay(OverlayId.MINI_CART),
  }),

  isInWishlist: (productId, variantId) =>
    isWishlistItemSelected(get(), productId, variantId),

  getNotificationSettings: (productId, variantId) =>
    getWishlistNotificationSettings(get(), productId, variantId),

  clearError: () => set({ error: null }),
}));
