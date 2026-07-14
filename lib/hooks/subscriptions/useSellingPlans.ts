'use client';

import { useCallback, useState } from 'react';
import { getProductSellingPlans } from '@/lib/api/services/selling-plans';
import type { SellingPlan } from '@/lib/api/types/selling-plans';
import { getSubscriptionErrorMessage } from './shared';
import type { UseSellingPlansReturn } from './types';

export function useSellingPlans(): UseSellingPlansReturn {
  const [sellingPlans, setSellingPlans] = useState<SellingPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPlans = useCallback(async (productId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getProductSellingPlans(productId);
      setSellingPlans(response.sellingPlans);
    } catch (error: unknown) {
      setError(getSubscriptionErrorMessage(error, 'Failed to load selling plans'));
    } finally {
      setLoading(false);
    }
  }, []);

  const getDiscountedPrice = useCallback((planId: string) => {
    return sellingPlans.find((plan) => plan.id === planId)?.discountedPrice || 0;
  }, [sellingPlans]);

  const comparePlans = useCallback(() => {
    return sellingPlans.map((plan) => ({
      id: plan.id,
      name: plan.name,
      savings: plan.savings,
      savingsPercent: plan.savingsPercent,
    }));
  }, [sellingPlans]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    sellingPlans,
    loading,
    error,
    loadPlans,
    getDiscountedPrice,
    comparePlans,
    clearError,
  };
}
