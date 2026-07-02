'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { AnalyticsEventType } from '@/lib/api/types/analytics';
import { useAnalytics } from '@/lib/analytics';
import { CartEmpty } from '@/components/cart/CartEmpty';
import { CartItemList } from '@/components/cart/CartItemList';
import { CartSummary } from '@/components/cart/CartSummary';
import { ContinueShoppingButton } from '@/components/cart/ContinueShoppingButton';
import { FreeShippingProgress } from '@/components/cart/FreeShippingProgress';
import { useCart, type Cart, type TaxLocation } from '@/lib/hooks';
import { useCartStore } from '@/lib/stores/cart-store';
import { calculateCartTotal } from '@/lib/utils/ecommerce';

interface CartPageClientProps {
  initialCart: Cart | null;
}

export default function CartPageClient({ initialCart }: CartPageClientProps) {
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

  if (!loading && activeItems.length === 0) {
    return (
      <main className="min-h-screen bg-bg-base text-text-base">
        <div className="mx-auto max-w-[1440px] px-6 py-8 md:px-12 md:py-12 lg:px-20">
          <CartEmpty />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg-base text-text-base">
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 md:px-12 md:py-12 lg:px-20">
        <div className="flex flex-col gap-6 md:gap-8 lg:flex-row lg:gap-12">
          <div className="flex-1">
            <div className="mb-6 flex flex-col gap-1 md:mb-8 md:gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-text-base md:text-3xl lg:text-4xl">
                Your Shopping Bag
              </h1>
              <p className="text-sm text-text-muted md:text-base">
                {activeItemCount} {activeItemCount === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>

            <FreeShippingProgress currentTotal={totals.subtotal} className="mb-6 md:mb-8" />
            <CartItemList
              items={activeItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemove}
              isPending={isPending}
            />

            <div className="mt-6 md:mt-8">
              <ContinueShoppingButton />
            </div>
          </div>

          <div className="w-full flex-shrink-0 lg:w-[400px]">
            <div className="lg:sticky lg:top-24">
              <CartSummary
                subtotal={totals.subtotal}
                shipping={totals.shipping === 0 ? 0 : null}
                tax={totals.tax > 0 ? totals.tax : null}
                total={totals.total}
                itemCount={activeItemCount}
                items={activeItems}
                onEstimateTax={handleEstimateTax}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
