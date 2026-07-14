import { apiRequest } from '../../core/client';
import type {
  ApiRequestOptions,
  DownloadStats,
  DownloadStatsResponse,
  LicenseInfo,
  LicenseInfoResponse,
} from '../../types';
import { unwrapResponseData } from '../../utils';
import { validateLicenseKey } from './shared';

export async function getLicenseInfo(
  licenseKey: string,
  options: ApiRequestOptions = {},
): Promise<LicenseInfo> {
  const sanitizedKey = validateLicenseKey(licenseKey);

  return unwrapResponseData(
    await apiRequest<LicenseInfoResponse>(`/delivery/info/${encodeURIComponent(sanitizedKey)}`, {
      cache: 'no-store',
      unwrapResponse: false,
      ...options,
    }),
  );
}

export async function getDownloadStats(
  licenseKey: string,
  options: ApiRequestOptions = {},
): Promise<DownloadStats> {
  const sanitizedKey = validateLicenseKey(licenseKey);

  return unwrapResponseData(
    await apiRequest<DownloadStatsResponse>(`/delivery/stats/${encodeURIComponent(sanitizedKey)}`, {
      cache: 'no-store',
      unwrapResponse: false,
      ...options,
    }),
  );
}
