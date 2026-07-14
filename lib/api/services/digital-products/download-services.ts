import { API_BASE_URL, WEBSITE_ID, buildQueryString } from '../../core/client';
import { ApiError } from '../../core/errors';
import type { LicenseInfo } from '../../types';
import { assertDownloadableLicense, validateLicenseKey } from './shared';
import { getLicenseInfo } from './query-services';

async function fetchDownloadBlob(downloadPath: string): Promise<Blob> {
  const headers: Record<string, string> = {};

  if (WEBSITE_ID) {
    headers['X-Website-Id'] = WEBSITE_ID;
  }

  const response = await fetch(`${API_BASE_URL}${downloadPath}`, {
    method: 'GET',
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    let message = 'Failed to download file';
    let code = 'DOWNLOAD_FAILED';

    try {
      const data = (await response.json()) as { message?: string; code?: string };
      message = data.message || message;
      code = data.code || code;
    } catch {
      // Ignore non-JSON responses.
    }

    throw new ApiError(message, response.status, code);
  }

  return response.blob();
}

export function getDownloadUrl(licenseKey: string): string {
  const sanitizedKey = validateLicenseKey(licenseKey);
  const downloadPath = `/delivery/download/${encodeURIComponent(sanitizedKey)}`;

  return `${API_BASE_URL}${downloadPath}${buildQueryString(
    WEBSITE_ID ? { websiteId: WEBSITE_ID } : {},
  )}`;
}

export async function downloadDigitalFile(licenseKey: string): Promise<LicenseInfo> {
  const sanitizedKey = validateLicenseKey(licenseKey);
  const licenseInfo = await getLicenseInfo(sanitizedKey);

  assertDownloadableLicense(licenseInfo);

  if (typeof window === 'undefined') {
    return licenseInfo;
  }

  try {
    const blob = await fetchDownloadBlob(`/delivery/download/${encodeURIComponent(sanitizedKey)}`);
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = licenseInfo.assetName || 'download';
    link.rel = 'noopener';
    link.click();
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
  } catch {
    window.location.href = getDownloadUrl(sanitizedKey);
  }

  return licenseInfo;
}
