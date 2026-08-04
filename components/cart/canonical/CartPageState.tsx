'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';
import { AnalyticsEventType } from '@/lib/api/types/analytics';
import { useAnalytics } from '@/lib/analytics';
import { useCart, type Cart, type TaxLocation } from '@/lib/hooks';
import { useCartStore } from '@/lib/stores/cart-store';
import { calculateCartTotal } from '@/lib/utils/ecommerce';

export interface CartPageRuntime {
  items: ReturnType<typeof useCart>['items'];
  itemCount: number;
  totals: ReturnType<typeof calculateCartTotal>;
  isPending: boolean;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  remove: (productId: string) => Promise<void>;
  estimateTax: (location: TaxLocation) => Promise<void>;
}

const CartPageRuntimeContext = createContext<CartPageRuntime | null>(null);

export function useCartPageRuntime(): CartPageRuntime {
  const runtime = useContext(CartPageRuntimeContext);
  if (!runtime) {
    throw new Error('Cart page blocks must be nested inside CartPageState.');
  }
  return runtime;
}

export function CartPageState({
  initialCart,
  filled,
  empty,
}: {
  initialCart: Cart | null;
  filled?: ReactNode;
  empty?: ReactNode;
}) {
  const { trackEvent } = useAnalytics();
  const hydrateCart = useCartStore((state) => state.hydrateCart);
  const {
    cart,
    items,
    totalItems,
    loading,
    isPending,
    updateItem,
    removeItem,
    estimateTax,
  } = useCart(false);

  useEffect(() => {
    hydrateCart(initialCart);
  }, [hydrateCart, initialCart]);

  const activeCart = cart || initialCart;
  const activeItems = useMemo(
    () => (cart ? items : initialCart?.items || []),
    [cart, items, initialCart?.items],
  );
  const activeItemCount = cart ? totalItems : initialCart?.totalItems || 0;
  const totals = calculateCartTotal(activeCart);

  const handleUpdateQuantity = useCallback(async (productId: string, quantity: number) => {
    await updateItem(productId, quantity);
  }, [updateItem]);

  const handleRemove = useCallback(async (productId: string) => {
    const item = activeItems.find((entry) => entry.productId === productId);

    if (item) {
      void trackEvent(AnalyticsEventType.REMOVE_FROM_CART, {
        productId,
        quantity: item.quantity,
      });
    }

    await removeItem(productId);
  }, [activeItems, removeItem, trackEvent]);

  const handleEstimateTax = useCallback(async (location: TaxLocation) => {
    await estimateTax(location);
  }, [estimateTax]);

  const runtime = useMemo<CartPageRuntime>(() => ({
    items: activeItems,
    itemCount: activeItemCount,
    totals,
    isPending,
    updateQuantity: handleUpdateQuantity,
    remove: handleRemove,
    estimateTax: handleEstimateTax,
  }), [activeItemCount, activeItems, handleEstimateTax, handleRemove, handleUpdateQuantity, isPending, totals]);

  return (
    <CartPageRuntimeContext.Provider value={runtime}>
      {!loading && activeItems.length === 0 ? empty : filled}
    </CartPageRuntimeContext.Provider>
  );
}
