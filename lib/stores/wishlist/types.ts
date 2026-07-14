'use client';

import type { WishlistNotificationType } from '@/lib/api/types/wishlist';
import type { Wishlist } from '@/lib/api/types/wishlist';

export interface NotificationSettings {
  notifyOnPriceDrop: boolean;
  notifyOnBackInStock: boolean;
}

export interface WishlistStoreState {
  wishlist: Wishlist | null;
  totalItems: number;
  loading: boolean;
  isPending: boolean;
  error: string | null;
  loaded: boolean;
  hydrateWishlist: (wishlist: Wishlist | null) => void;
  refreshWishlist: () => Promise<void>;
  ensureWishlistLoaded: () => Promise<void>;
  addItem: (productId: string, variantId?: string) => Promise<void>;
  removeItem: (productId: string, variantId?: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  moveToCart: (productId: string, variantId?: string, quantity?: number) => Promise<void>;
  moveAllToCart: () => Promise<void>;
  toggleNotification: (
    productId: string,
    type: WishlistNotificationType,
    variantId?: string,
  ) => Promise<void>;
  isInWishlist: (productId: string, variantId?: string) => boolean;
  getNotificationSettings: (
    productId: string,
    variantId?: string,
  ) => NotificationSettings | null;
  clearError: () => void;
}

export interface WishlistSnapshot {
  wishlist: Wishlist | null;
  totalItems: number;
  loaded: boolean;
}

export interface WishlistCommandContext {
  getState: () => WishlistStoreState;
  setState: (
    partial:
      | Partial<WishlistStoreState>
      | ((state: WishlistStoreState) => Partial<WishlistStoreState>),
    replace?: false,
  ) => void;
  hydrateCart: (cart: import('@/lib/api/types/cart').Cart | null) => void;
  refreshCart: () => Promise<void>;
  openMiniCart: () => void;
}

export type WishlistStoreMethods = Pick<
  WishlistStoreState,
  | 'refreshWishlist'
  | 'ensureWishlistLoaded'
  | 'addItem'
  | 'removeItem'
  | 'clearWishlist'
  | 'moveToCart'
  | 'moveAllToCart'
  | 'toggleNotification'
>;

export type { Wishlist, WishlistNotificationType };
