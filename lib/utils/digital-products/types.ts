import {
  LicenseStatusCode,
  type DownloadStats,
  type LicenseInfo,
  type LicenseStatus,
} from '@/lib/api/types/digital-products';

export enum PendingLicenseStatus {
  PENDING = 'pending',
}

export type LicenseStatusLike = LicenseStatus | `${PendingLicenseStatus}` | null;

export interface LicenseInfoData
  extends Pick<LicenseInfo, 'downloadsRemaining' | 'isValid' | 'status'> {
  downloadLimit?: number | null;
  expiresAt?: string | null;
}

export interface DownloadStatsInfo
  extends Pick<DownloadStats, 'downloadCount'> {
  lastAccessedAt?: string | null;
  lastDownloadAt?: string | Date | null;
}

export interface LicenseStatusDisplay {
  label: string;
  color: 'green' | 'yellow' | 'red' | 'gray';
  icon: 'check' | 'clock' | 'x' | 'minus';
}

export interface DownloadInfo {
  remaining: number | null;
  total: number | null;
  unlimited: boolean;
  displayText: string;
}

export interface ExpiryInfo {
  daysRemaining: number | null;
  isExpired: boolean;
  isExpiringSoon: boolean;
  displayText: string;
}

export const LICENSE_STATUS_MAP: Record<
  Exclude<LicenseStatusLike, null>,
  LicenseStatusDisplay
> = {
  [LicenseStatusCode.ACTIVE]: { label: 'Active', color: 'green', icon: 'check' },
  [LicenseStatusCode.EXPIRED]: { label: 'Expired', color: 'red', icon: 'x' },
  [LicenseStatusCode.REVOKED]: { label: 'Revoked', color: 'red', icon: 'x' },
  [PendingLicenseStatus.PENDING]: { label: 'Pending', color: 'yellow', icon: 'clock' },
};
