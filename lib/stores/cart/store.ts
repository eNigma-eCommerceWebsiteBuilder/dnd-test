'use client';

import { create } from 'zustand';
import { OverlayId, useOverlayStore } from '../overlay-store';
import { createCartCommands } from './commands';
import { createCartSnapshot } from './helpers';
import { getCartItemQuantity, isProductInCart } from './selectors';
import type { CartStoreState } from './types';

export const useCartStore = create<CartStoreState>((set, get) => ({
  cart: null,
  totalItems: 0,
  loading: false,
  countLoading: false,
  isPending: false,
  error: null,
  cartLoaded: false,
  countLoaded: false,

  hydrateCart: (cart) => {
    set({
      ...createCartSnapshot(cart),
      loading: false,
      countLoading: false,
      error: null,
    });
  },

  ...createCartCommands({
    getState: get,
    setState: set,
    openMiniCart: () => useOverlayStore.getState().openOverlay(OverlayId.MINI_CART),
  }),

  getItemQuantity: (productId) => getCartItemQuantity(get().cart, productId),
  isInCart: (productId) => isProductInCart(get().cart, productId),
  clearError: () => set({ error: null }),
}));
