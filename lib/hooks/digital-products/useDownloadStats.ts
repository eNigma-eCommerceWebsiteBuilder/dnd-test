'use client';

import { useCallback, useState } from 'react';
import { getDownloadStats } from '@/lib/api/services/digital-products';
import type { DownloadStats } from '@/lib/api/types/digital-products';
import { getErrorMessage } from '@/lib/hooks/internal/errors';
import type { UseDownloadStatsReturn } from './types';

export function useDownloadStats(): UseDownloadStatsReturn {
  const [stats, setStats] = useState<DownloadStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentKey, setCurrentKey] = useState<string | null>(null);

  const loadStats = useCallback(async (licenseKey: string) => {
    setLoading(true);
    setError(null);
    setCurrentKey(licenseKey);

    try {
      const result = await getDownloadStats(licenseKey);
      setStats(result);
    } catch (error: unknown) {
      setError(getErrorMessage(error, 'Failed to load download statistics'));
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    if (currentKey) {
      await loadStats(currentKey);
    }
  }, [currentKey, loadStats]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    stats,
    loading,
    error,
    loadStats,
    refresh,
    clearError,
  };
}
