'use client';

import type { Cart, CartItem, Location } from '@/lib/api/types/cart';

export type TaxLocation = Location;

export interface CartStoreState {
  cart: Cart | null;
  totalItems: number;
  loading: boolean;
  countLoading: boolean;
  isPending: boolean;
  error: string | null;
  cartLoaded: boolean;
  countLoaded: boolean;
  hydrateCart: (cart: Cart | null) => void;
  refreshCart: () => Promise<void>;
  refreshCount: () => Promise<void>;
  ensureCartLoaded: () => Promise<void>;
  ensureCountLoaded: () => Promise<void>;
  addItem: (productId: string, quantity?: number, variantId?: string) => Promise<void>;
  updateItem: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  captureEmail: (email: string) => Promise<void>;
  estimateTax: (location: TaxLocation) => Promise<void>;
  getItemQuantity: (productId: string) => number;
  isInCart: (productId: string) => boolean;
  clearError: () => void;
}

export interface CartSnapshot {
  cart: Cart | null;
  totalItems: number;
  cartLoaded: boolean;
  countLoaded: boolean;
}

export interface CartCommandContext {
  getState: () => CartStoreState;
  setState: (
    partial:
      | Partial<CartStoreState>
      | ((state: CartStoreState) => Partial<CartStoreState>),
    replace?: false,
  ) => void;
  openMiniCart: () => void;
}

export type CartStoreMethods = Pick<
  CartStoreState,
  | 'refreshCart'
  | 'refreshCount'
  | 'ensureCartLoaded'
  | 'ensureCountLoaded'
  | 'addItem'
  | 'updateItem'
  | 'removeItem'
  | 'clearCart'
  | 'captureEmail'
  | 'estimateTax'
>;

export type { Cart, CartItem };
