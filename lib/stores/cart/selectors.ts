'use client';

import type { Cart } from './types';

export function getCartItemQuantity(cart: Cart | null, productId: string): number {
  if (!cart) {
    return 0;
  }

  return cart.items.find((item) => item.productId === productId)?.quantity ?? 0;
}

export function isProductInCart(cart: Cart | null, productId: string): boolean {
  if (!cart) {
    return false;
  }

  return cart.items.some((item) => item.productId === productId);
}
