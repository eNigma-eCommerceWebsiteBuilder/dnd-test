'use client';

import type { TaxEstimateResult } from '@/lib/actions/types';
import type { Cart, CartItem, CartSnapshot } from './types';

export function createCartSnapshot(cart: Cart | null): CartSnapshot {
  return {
    cart,
    totalItems: cart?.totalItems ?? 0,
    cartLoaded: true,
    countLoaded: true,
  };
}

export function matchesCartItem(
  item: CartItem,
  productId: string,
  variantId?: string,
): boolean {
  return item.productId === productId && (variantId ? item.variantId === variantId : true);
}

export function recalculateCart(cart: Cart, items: CartItem[]): Cart {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const tax = cart.tax ?? 0;

  return {
    ...cart,
    items,
    subtotal,
    totalItems,
    total: subtotal + tax,
  };
}

export function applyEstimatedTax(cart: Cart, estimate: TaxEstimateResult): Cart {
  return {
    ...cart,
    tax: 'totalTax' in estimate ? estimate.totalTax : estimate.estimatedTax,
    taxLines: 'taxLines' in estimate ? estimate.taxLines : [],
  };
}
