'use client';

import { useCallback, useState } from 'react';
import { addSubscriptionToCartAction, createSubscriptionCheckoutAction } from '@/lib/actions/subscription-checkout/actions';
import { assertActionSuccess } from '@/lib/hooks/internal/errors';
import { getSubscriptionErrorMessage } from './shared';
import type { Address } from '@/lib/api/types/orders';
import type { UseSubscriptionCheckoutReturn } from './types';

interface CustomerInfo {
  email: string;
  name: string;
}

export function useSubscriptionCheckout(): UseSubscriptionCheckoutReturn {
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCheckout = useCallback(async (
    customerInfo: CustomerInfo,
    shippingAddress: Address,
    successUrl: string,
    cancelUrl: string,
  ) => {
    setProcessing(true);
    setError(null);

    try {
      const result = await createSubscriptionCheckoutAction(null, {
        customerEmail: customerInfo.email,
        customerName: customerInfo.name,
        shippingAddress,
        successUrl,
        cancelUrl,
      });

      if (!result.success || !result.checkoutUrl) {
        throw new Error(result.error || 'Failed to create checkout');
      }

      setCheckoutUrl(result.checkoutUrl);
      return result.checkoutUrl;
    } catch (error: unknown) {
      const message = getSubscriptionErrorMessage(error, 'Failed to create checkout');
      setError(message);
      throw new Error(message);
    } finally {
      setProcessing(false);
    }
  }, []);

  const addSubscriptionToCart = useCallback(async (
    productId: string,
    sellingPlanId: string,
    quantity: number,
    variantId?: string,
  ) => {
    try {
      const result = await addSubscriptionToCartAction(null, {
        productId,
        sellingPlanId,
        quantity,
        variantId,
      });
      assertActionSuccess(result, 'Failed to add to cart');
    } catch (error: unknown) {
      const message = getSubscriptionErrorMessage(error, 'Failed to add to cart');
      setError(message);
      throw new Error(message);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    checkoutUrl,
    processing,
    error,
    createCheckout,
    addSubscriptionToCart,
    clearError,
  };
}
