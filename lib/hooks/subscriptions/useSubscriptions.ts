'use client';

import { useCallback, useState } from 'react';
import { getMySubscriptionsAction } from '@/lib/actions/subscriptions/query-actions';
import type { SubscriptionContract, SubscriptionStatus } from '@/lib/api/types/subscriptions';
import { getSubscriptionErrorMessage } from './shared';
import type { UseSubscriptionsOptions, UseSubscriptionsReturn } from './types';

export function useSubscriptions(
  options?: UseSubscriptionsOptions,
): UseSubscriptionsReturn {
  const {
    initialSubscriptions = [],
    initialFilter = null,
    disableFetch = false,
  } = options ?? {};
  const [subscriptions, setSubscriptions] = useState<SubscriptionContract[]>(initialSubscriptions);
  const [filter, setFilter] = useState<SubscriptionStatus | null>(initialFilter);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSubscriptions = useCallback(async (
    status?: SubscriptionStatus,
    page: number = 1,
    limit: number = 10,
  ) => {
    if (disableFetch) {
      setFilter(status ?? null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getMySubscriptionsAction(status, page, limit);
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to load subscriptions');
      }

      setSubscriptions(result.data.subscriptions);
      setFilter(status ?? null);
    } catch (error: unknown) {
      setError(getSubscriptionErrorMessage(error, 'Failed to load subscriptions'));
    } finally {
      setLoading(false);
    }
  }, [disableFetch]);

  const filterByStatus = useCallback((status: SubscriptionStatus | null) => {
    setFilter(status);
    if (!disableFetch) {
      void loadSubscriptions(status ?? undefined);
    }
  }, [disableFetch, loadSubscriptions]);

  const refreshSubscriptions = useCallback(async () => {
    if (!disableFetch) {
      await loadSubscriptions(filter ?? undefined);
    }
  }, [disableFetch, filter, loadSubscriptions]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    subscriptions,
    filter,
    loading,
    error,
    loadSubscriptions,
    filterByStatus,
    refreshSubscriptions,
    clearError,
  };
}
