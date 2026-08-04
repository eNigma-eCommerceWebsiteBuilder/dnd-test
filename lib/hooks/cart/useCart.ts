'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/lib/stores/cart-store';
import type { CartStoreState } from '@/lib/stores/cart/types';
import type { UseCartReturn } from './types';

const EMPTY_ITEMS: never[] = [];

const selectCart = (s: CartStoreState) => s.cart;
const selectItems = (s: CartStoreState) => s.cart?.items ?? EMPTY_ITEMS;
const selectTotalItems = (s: CartStoreState) => s.totalItems;
const selectTotalPrice = (s: CartStoreState) => s.cart?.total ?? 0;
const selectLoading = (s: CartStoreState) => s.loading;
const selectIsPending = (s: CartStoreState) => s.isPending;
const selectError = (s: CartStoreState) => s.error;
const selectEnsureCartLoaded = (s: CartStoreState) => s.ensureCartLoaded;
const selectAddItem = (s: CartStoreState) => s.addItem;
const selectUpdateItem = (s: CartStoreState) => s.updateItem;
const selectRemoveItem = (s: CartStoreState) => s.removeItem;
const selectClearCart = (s: CartStoreState) => s.clearCart;
const selectCaptureEmail = (s: CartStoreState) => s.captureEmail;
const selectEstimateTax = (s: CartStoreState) => s.estimateTax;
const selectRefreshCart = (s: CartStoreState) => s.refreshCart;
const selectGetItemQuantity = (s: CartStoreState) => s.getItemQuantity;
const selectIsInCart = (s: CartStoreState) => s.isInCart;
const selectClearError = (s: CartStoreState) => s.clearError;

export function useCart(autoLoad: boolean = true): UseCartReturn {
  const cart = useCartStore(selectCart);
  const items = useCartStore(selectItems);
  const totalItems = useCartStore(selectTotalItems);
  const totalPrice = useCartStore(selectTotalPrice);
  const loading = useCartStore(selectLoading);
  const isPending = useCartStore(selectIsPending);
  const error = useCartStore(selectError);
  const ensureCartLoaded = useCartStore(selectEnsureCartLoaded);
  const addItem = useCartStore(selectAddItem);
  const updateItem = useCartStore(selectUpdateItem);
  const removeItem = useCartStore(selectRemoveItem);
  const clearCart = useCartStore(selectClearCart);
  const captureEmail = useCartStore(selectCaptureEmail);
  const estimateTax = useCartStore(selectEstimateTax);
  const refreshCart = useCartStore(selectRefreshCart);
  const getItemQuantity = useCartStore(selectGetItemQuantity);
  const isInCart = useCartStore(selectIsInCart);
  const clearError = useCartStore(selectClearError);

  useEffect(() => {
    if (!autoLoad) {
      return;
    }
    void ensureCartLoaded();
  }, [autoLoad, ensureCartLoaded]);

  return {
    cart,
    items,
    totalItems,
    totalPrice,
    loading,
    isPending,
    error,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    captureEmail,
    estimateTax,
    refreshCart,
    getItemQuantity,
    isInCart,
    clearError,
  };
}
