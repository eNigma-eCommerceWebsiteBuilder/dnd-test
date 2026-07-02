'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { PaymentMethodId } from '@/lib/api/types/payments';
import { AnalyticsEventType } from '@/lib/api/types/analytics';
import { useAnalytics } from '@/lib/analytics';
import { useCart, useCheckout, type Cart } from '@/lib/hooks';
import { useCartStore } from '@/lib/stores/cart-store';
import { calculateCartTotal } from '@/lib/utils/ecommerce';

interface UseCheckoutPageStateOptions {
  initialCart: Cart;
  initialEmail?: string;
}

export function useCheckoutPageState({
  initialCart,
  initialEmail = '',
}: UseCheckoutPageStateOptions) {
  const { trackEvent } = useAnalytics();
  const hasTrackedCheckoutStartRef = useRef(false);
  const hydrateCart = useCartStore((state) => state.hydrateCart);
  const { cart, totalItems } = useCart(false);
  const checkout = useCheckout();
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<PaymentMethodId>(PaymentMethodId.STRIPE);
  const [contactEmail, setContactEmail] = useState(initialEmail);

  useEffect(() => {
    hydrateCart(initialCart);
  }, [hydrateCart, initialCart]);

  const activeCart = cart || initialCart;
  const activeItems = useMemo(
    () => cart?.items || initialCart.items || [],
    [cart?.items, initialCart.items],
  );
  const activeItemCount = totalItems || initialCart.totalItems || activeItems.length;
  const totals = calculateCartTotal(activeCart);
  const taxAmount = totals.tax;
  const totalWithTax = totals.subtotal - totals.discount + taxAmount + (checkout.selectedShippingMethod?.price || 0);

  useEffect(() => {
    if (hasTrackedCheckoutStartRef.current || activeItems.length === 0) {
      return;
    }

    hasTrackedCheckoutStartRef.current = true;
    void trackEvent(AnalyticsEventType.CHECKOUT_STARTED, {
      cartValue: totals.total,
      itemCount: activeItemCount,
    });
  }, [activeItemCount, activeItems.length, totals.total, trackEvent]);

  return {
    activeItemCount,
    activeItems,
    checkout,
    contactEmail,
    selectedPaymentMethodId,
    setContactEmail,
    setSelectedPaymentMethodId,
    taxAmount,
    totals,
    totalWithTax,
  };
}
