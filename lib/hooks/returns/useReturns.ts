'use client';

import { useCallback, useState } from 'react';
import { getMyReturnsAction } from '@/lib/actions/returns/query-actions';
import type { ReturnStatus, ReturnsListResponse } from '@/lib/api/types/returns';
import { getReturnErrorMessage } from './shared';
import type { UseReturnsReturn } from './types';

export function useReturns(): UseReturnsReturn {
  const [returns, setReturns] = useState<ReturnsListResponse['data']>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<ReturnStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadReturns = useCallback(async (
    status?: ReturnStatus,
    page: number = 1,
    limit: number = 10,
  ) => {
    setLoading(true);
    setError(null);

    try {
      const result = await getMyReturnsAction(status, page, limit);
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to load returns');
      }

      setReturns(result.data);
      setFilter(status ?? null);
    } catch (error: unknown) {
      setError(getReturnErrorMessage(error, 'Failed to load returns'));
    } finally {
      setLoading(false);
    }
  }, []);

  const filterByStatus = useCallback((status: ReturnStatus | null) => {
    setFilter(status);
    void loadReturns(status ?? undefined);
  }, [loadReturns]);

  const refreshReturns = useCallback(async () => {
    await loadReturns(filter ?? undefined);
  }, [filter, loadReturns]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    returns,
    loading,
    filter,
    error,
    loadReturns,
    filterByStatus,
    refreshReturns,
    clearError,
  };
}
