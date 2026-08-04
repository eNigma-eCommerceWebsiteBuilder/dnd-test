import { cache } from 'react';

import { getLicenseInfo } from '@/lib/api/services/digital-products';
import type { LicenseInfo } from '@/lib/api/types/digital-products';
import { getRouteParam, type PuckFetcherContext } from '@/lib/puck-route-metadata';

export interface DownloadRuntime {
  licenseKey: string;
  licenseInfo: LicenseInfo | null;
}

// Mirrors app/downloads/[key]/page.tsx: the license key comes from the route.
export function resolveLicenseKey(context?: PuckFetcherContext): string {
  return getRouteParam(context, 'key') || '';
}

const loadLicense = cache(async (licenseKey: string): Promise<DownloadRuntime> => {
  if (!licenseKey) {
    return { licenseKey, licenseInfo: null };
  }

  try {
    return { licenseKey, licenseInfo: await getLicenseInfo(licenseKey) };
  } catch {
    return { licenseKey, licenseInfo: null };
  }
});

export function loadDownloadRuntime(context?: PuckFetcherContext): Promise<DownloadRuntime> {
  return loadLicense(resolveLicenseKey(context));
}
