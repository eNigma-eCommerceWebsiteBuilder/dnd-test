'use client';

import { useCallback, useState } from 'react';
import { previewSubscriptionPricing } from '@/lib/api/services/selling-plans';
import type { SubscriptionPreview } from '@/lib/api/types/selling-plans';
import { getSubscriptionErrorMessage } from './shared';
import type { UseSubscriptionPreviewReturn } from './types';

export function useSubscriptionPreview(): UseSubscriptionPreviewReturn {
  const [preview, setPreview] = useState<SubscriptionPreview | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const previewPricing = useCallback(async (
    productId: string,
    sellingPlanId: string,
    quantity: number,
    variantId?: string,
  ) => {
    setCalculating(true);
    setError(null);

    try {
      const response = await previewSubscriptionPricing({
        productId,
        sellingPlanId,
        quantity,
        variantId,
      });
      setPreview(response);
    } catch (error: unknown) {
      const message = getSubscriptionErrorMessage(error, 'Failed to preview pricing');
      setError(message);
      throw new Error(message);
    } finally {
      setCalculating(false);
    }
  }, []);

  const getSavings = useCallback(() => {
    return preview?.pricing.savings.total || 0;
  }, [preview]);

  const getFirstBillingAmount = useCallback(() => {
    return preview?.pricing.firstBillingPrice || 0;
  }, [preview]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    preview,
    calculating,
    error,
    previewPricing,
    getSavings,
    getFirstBillingAmount,
    clearError,
  };
}
