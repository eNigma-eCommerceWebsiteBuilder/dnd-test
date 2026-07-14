'use client';

import { useCallback, useState } from 'react';
import { downloadDigitalProductAction } from '@/lib/actions/digital-products/actions';
import { getDownloadUrl } from '@/lib/api/services/digital-products';
import { getErrorMessage } from '@/lib/hooks/internal/errors';
import type { UseDigitalDownloadReturn } from './types';

export function useDigitalDownload(): UseDigitalDownloadReturn {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const download = useCallback(async (licenseKey: string) => {
    setDownloading(true);
    setError(null);

    try {
      const result = await downloadDigitalProductAction(licenseKey);
      if (!result.success || !result.data?.downloadUrl) {
        throw new Error(result.error || 'Failed to initiate download');
      }

      window.location.href = result.data.downloadUrl;
    } catch (error: unknown) {
      const message = getErrorMessage(error, 'Failed to initiate download');
      setError(message);
      throw new Error(message);
    } finally {
      setDownloading(false);
    }
  }, []);

  const getUrl = useCallback((licenseKey: string) => {
    return getDownloadUrl(licenseKey);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    downloading,
    error,
    download,
    getUrl,
    clearError,
  };
}
