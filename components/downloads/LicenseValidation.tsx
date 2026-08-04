import type { LicenseInfo } from '@/lib/api/types/digital-products';
import { formatLicenseStatus, hasDownloadsRemaining, isLicenseValid } from '@/lib/utils/digital-products';

const STATUS_STYLES: Record<string, string> = { green: 'border-success bg-success-subtle text-success', yellow: 'border-warning bg-warning-subtle text-warning', red: 'border-danger bg-danger-subtle text-danger', gray: 'border-border bg-bg-elevated text-text-muted' };

export function LicenseValidation({ licenseInfo }: { licenseInfo: LicenseInfo | null }) {
  if (!licenseInfo) return null;
  const snapshot = { isValid: licenseInfo.isValid, status: licenseInfo.status, downloadsRemaining: licenseInfo.downloadsRemaining, expiresAt: licenseInfo.expiresAt ?? undefined };
  const statusDisplay = formatLicenseStatus(licenseInfo.status);
  const canDownload = isLicenseValid(snapshot) && hasDownloadsRemaining(snapshot);
  return <div className="@container flex flex-wrap items-center gap-2"><span className={`inline-flex items-center rounded-badge border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${STATUS_STYLES[statusDisplay.color]}`}>{statusDisplay.label}</span><span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">Digital Download</span><span className={`text-xs font-semibold ${canDownload ? 'text-success' : 'text-danger'}`}>{canDownload ? 'Validated' : 'Action Required'}</span></div>;
}
