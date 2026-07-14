import type { ExpiryInfo, LicenseInfoData } from './types';

export function calculateDaysUntilExpiry(license: LicenseInfoData | null): number | null {
  if (!license?.expiresAt) {
    return null;
  }

  const expiryDate = new Date(license.expiresAt);
  const diffMs = expiryDate.getTime() - Date.now();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function isLicenseExpiringSoon(
  license: LicenseInfoData | null,
  thresholdDays: number = 7,
): boolean {
  const daysRemaining = calculateDaysUntilExpiry(license);
  return daysRemaining !== null && daysRemaining > 0 && daysRemaining <= thresholdDays;
}

export function getExpiryInfo(license: LicenseInfoData | null): ExpiryInfo {
  if (!license?.expiresAt) {
    return {
      daysRemaining: null,
      isExpired: false,
      isExpiringSoon: false,
      displayText: 'No expiration',
    };
  }

  const daysRemaining = calculateDaysUntilExpiry(license);
  const isExpired = daysRemaining !== null && daysRemaining <= 0;
  const expiringSoon = !isExpired && isLicenseExpiringSoon(license);
  const displayText =
    isExpired
      ? 'Expired'
      : daysRemaining === 1
        ? 'Expires tomorrow'
        : daysRemaining !== null
          ? `Expires in ${daysRemaining} days`
          : 'No expiration';

  return {
    daysRemaining,
    isExpired,
    isExpiringSoon: expiringSoon,
    displayText,
  };
}
