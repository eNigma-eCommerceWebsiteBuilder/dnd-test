import { LicenseStatusCode } from '@/lib/api/types/digital-products';
import {
  LICENSE_STATUS_MAP,
  type LicenseInfoData,
  type LicenseStatusDisplay,
  type LicenseStatusLike,
} from './types';

export function isLicenseValid(license: LicenseInfoData | null): boolean {
  if (!license?.isValid || license.status !== LicenseStatusCode.ACTIVE) {
    return false;
  }

  if (license.downloadsRemaining !== null && license.downloadsRemaining <= 0) {
    return false;
  }

  return !license.expiresAt || new Date(license.expiresAt) >= new Date();
}

export function hasDownloadsRemaining(license: LicenseInfoData | null): boolean {
  if (!license) {
    return false;
  }

  return license.downloadsRemaining === null || license.downloadsRemaining > 0;
}

export function formatLicenseStatus(
  status: LicenseStatusLike,
): LicenseStatusDisplay {
  return status ? LICENSE_STATUS_MAP[status] : { label: 'Unknown', color: 'gray', icon: 'minus' };
}

export function getLicenseStatusBadge(
  license: LicenseInfoData | null,
): { color: string; label: string } {
  if (!license) {
    return { color: 'gray', label: 'No License' };
  }

  if (!license.isValid) {
    return { color: 'red', label: 'Invalid' };
  }

  const statusDisplay = formatLicenseStatus(license.status);
  return { color: statusDisplay.color, label: statusDisplay.label };
}
