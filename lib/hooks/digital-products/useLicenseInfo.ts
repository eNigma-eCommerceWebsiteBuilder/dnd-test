'use client';

import { useCallback, useMemo, useState } from 'react';
import { validateLicenseAction } from '@/lib/actions/digital-products/actions';
import type { LicenseInfo } from '@/lib/api/types/digital-products';
import { getErrorMessage } from '@/lib/hooks/internal/errors';
import { isLicenseValid } from '@/lib/utils/digital-products';
import type { UseLicenseInfoReturn } from './types';

export function useLicenseInfo(): UseLicenseInfoReturn {
  const [licenseInfo, setLicenseInfo] = useState<LicenseInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentKey, setCurrentKey] = useState<string | null>(null);

  const loadLicenseInfo = useCallback(async (licenseKey: string) => {
    setLoading(true);
    setError(null);
    setCurrentKey(licenseKey);

    try {
      const result = await validateLicenseAction(licenseKey);
      if (!result.success || !result.data?.license) {
        throw new Error(result.error || 'Failed to load license information');
      }

      setLicenseInfo(result.data.license);
    } catch (error: unknown) {
      setError(getErrorMessage(error, 'Failed to load license information'));
      setLicenseInfo(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    if (currentKey) {
      await loadLicenseInfo(currentKey);
    }
  }, [currentKey, loadLicenseInfo]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const canDownload = useMemo(() => {
    return isLicenseValid(licenseInfo);
  }, [licenseInfo]);

  return {
    licenseInfo,
    loading,
    error,
    loadLicenseInfo,
    refresh,
    clearError,
    canDownload,
  };
}
