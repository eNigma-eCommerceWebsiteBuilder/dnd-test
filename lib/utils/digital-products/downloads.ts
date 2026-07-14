import type {
  DownloadInfo,
  DownloadStatsInfo,
  LicenseInfoData,
} from './types';

export function formatDownloadsRemaining(license: LicenseInfoData | null): string {
  if (!license) {
    return 'No license';
  }

  if (license.downloadLimit === null || license.downloadLimit === undefined) {
    return license.downloadsRemaining === null
      ? 'Unlimited downloads'
      : `${license.downloadsRemaining} downloads remaining`;
  }

  const remaining = license.downloadsRemaining ?? 0;
  if (remaining === 0) {
    return 'No downloads remaining';
  }

  if (remaining === 1) {
    return `1 download remaining (of ${license.downloadLimit})`;
  }

  return `${remaining} of ${license.downloadLimit} downloads remaining`;
}

export function getDownloadInfo(license: LicenseInfoData | null): DownloadInfo {
  if (!license) {
    return {
      remaining: null,
      total: null,
      unlimited: false,
      displayText: 'No license',
    };
  }

  const unlimited = license.downloadLimit === null || license.downloadLimit === undefined;
  return {
    remaining: license.downloadsRemaining,
    total: license.downloadLimit ?? null,
    unlimited,
    displayText: formatDownloadsRemaining(license),
  };
}

export function formatDownloadCount(stats: DownloadStatsInfo | null): string {
  if (!stats || stats.downloadCount === 0) {
    return 'No downloads yet';
  }

  return stats.downloadCount === 1
    ? 'Downloaded 1 time'
    : `Downloaded ${stats.downloadCount} times`;
}

export function formatLastDownload(stats: DownloadStatsInfo | null): string | null {
  const lastDownload = stats?.lastAccessedAt ?? stats?.lastDownloadAt;
  if (!lastDownload) {
    return null;
  }

  return new Date(lastDownload).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
