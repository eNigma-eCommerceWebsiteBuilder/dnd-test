'use client';

import { useCallback, useState } from 'react';
import { getSubscriptionDetailsAction, getSubscriptionOrdersAction } from '@/lib/actions/subscriptions/query-actions';
import { skipNextDeliveryAction } from '@/lib/actions/subscriptions/unsupported-actions';
import type { SubscriptionContract, SubscriptionDetailsResponse } from '@/lib/api/types/subscriptions';
import { assertActionSuccess } from '@/lib/hooks/internal/errors';
import { getSubscriptionErrorMessage } from './shared';
import type { UseSubscriptionReturn } from './types';

type UpcomingBilling = SubscriptionDetailsResponse['upcomingBilling'];

export function useSubscription(): UseSubscriptionReturn {
  const [subscription, setSubscription] = useState<SubscriptionContract | null>(null);
  const [upcomingBilling, setUpcomingBilling] = useState<UpcomingBilling | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const subscriptionId = subscription?._id ?? null;

  const loadSubscription = useCallback(async (subscriptionId: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await getSubscriptionDetailsAction(subscriptionId);
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to load subscription');
      }

      setSubscription(result.data.subscription);
      setUpcomingBilling(result.data.upcomingBilling);
    } catch (error: unknown) {
      setError(getSubscriptionErrorMessage(error, 'Failed to load subscription'));
    } finally {
      setLoading(false);
    }
  }, []);

  const getOrders = useCallback(async (page: number = 1, limit: number = 10) => {
    if (!subscription) {
      return {
        orders: [],
        pagination: { page: 1, limit: 10, total: 0, pages: 0 },
      };
    }

    const result = await getSubscriptionOrdersAction(subscription._id, page, limit);
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to load subscription orders');
    }

    return result.data;
  }, [subscription]);

  const skipNextDelivery = useCallback(async () => {
    if (!subscription) {
      return;
    }

    const result = await skipNextDeliveryAction(null, { subscriptionId: subscription._id });
    assertActionSuccess(result, 'Failed to skip delivery');
    await loadSubscription(subscription._id);
  }, [loadSubscription, subscription]);

  const refreshSubscription = useCallback(async () => {
    if (subscriptionId) {
      await loadSubscription(subscriptionId);
    }
  }, [loadSubscription, subscriptionId]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    subscription,
    upcomingBilling,
    loading,
    error,
    loadSubscription,
    getOrders,
    skipNextDelivery,
    refreshSubscription,
    clearError,
  };
}
