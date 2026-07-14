import type { LicenseInfo } from '../../types';
import { ApiError } from '../../core/errors';

export function validateLicenseKey(licenseKey: string): string {
  if (!licenseKey || typeof licenseKey !== 'string') {
    throw new ApiError('License key is required', 400, 'MISSING_LICENSE_KEY');
  }

  const trimmedKey = licenseKey.trim();
  if (trimmedKey.length === 0) {
    throw new ApiError('License key cannot be empty', 400, 'EMPTY_LICENSE_KEY');
  }

  if (!/^[a-zA-Z0-9-]+$/.test(trimmedKey)) {
    throw new ApiError('Invalid license key format', 400, 'INVALID_LICENSE_KEY_FORMAT');
  }

  return trimmedKey;
}

export function assertDownloadableLicense(licenseInfo: LicenseInfo): void {
  if (!licenseInfo.isValid) {
    if (licenseInfo.status === 'revoked') {
      throw new ApiError('This download link has been revoked', 403, 'LICENSE_REVOKED');
    }

    if (licenseInfo.status === 'expired') {
      throw new ApiError('This download link has expired', 403, 'LICENSE_EXPIRED');
    }

    throw new ApiError('This download is no longer available', 403, 'LICENSE_INVALID');
  }

  if (licenseInfo.downloadsRemaining !== null && licenseInfo.downloadsRemaining <= 0) {
    throw new ApiError(
      'Download limit reached. Please contact support for assistance.',
      403,
      'DOWNLOADS_EXHAUSTED',
    );
  }
}
