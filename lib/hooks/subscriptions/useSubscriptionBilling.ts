'use client';

import { useCallback, useState } from 'react';
import { getBillingHistoryAction } from '@/lib/actions/subscriptions/query-actions';
import {
  getBillingPortalAction,
  updateSubscriptionPaymentAction,
} from '@/lib/actions/subscriptions/unsupported-actions';
import { assertActionSuccess } from '@/lib/hooks/internal/errors';
import { getSubscriptionErrorMessage } from './shared';
import type { BillingAttempt } from '@/lib/api/types/subscriptions';
import type { UseSubscriptionBillingReturn } from './types';

export function useSubscriptionBilling(): UseSubscriptionBillingReturn {
  const [billingHistory, setBillingHistory] = useState<BillingAttempt[]>([]);
  const [updatingPayment, setUpdatingPayment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBillingHistory = useCallback(async (
    subscriptionId: string,
    page: number = 1,
    limit: number = 10,
  ) => {
    setLoading(true);
    setError(null);

    try {
      const result = await getBillingHistoryAction(subscriptionId, page, limit);
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to load billing history');
      }

      setBillingHistory(result.data.billingHistory);
    } catch (error: unknown) {
      setError(getSubscriptionErrorMessage(error, 'Failed to load billing history'));
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePaymentMethod = useCallback(async (subscriptionId: string, paymentMethodId: string) => {
    setUpdatingPayment(true);
    setError(null);

    try {
      const result = await updateSubscriptionPaymentAction(null, { subscriptionId, paymentMethodId });
      assertActionSuccess(result, 'Failed to update payment method');
    } catch (error: unknown) {
      const message = getSubscriptionErrorMessage(error, 'Failed to update payment method');
      setError(message);
      throw new Error(message);
    } finally {
      setUpdatingPayment(false);
    }
  }, []);

  const openBillingPortal = useCallback(async (returnUrl?: string) => {
    const result = await getBillingPortalAction(returnUrl);
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to open billing portal');
    }

    return result.data.url;
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    billingHistory,
    updatingPayment,
    loading,
    error,
    loadBillingHistory,
    updatePaymentMethod,
    openBillingPortal,
    clearError,
  };
}
