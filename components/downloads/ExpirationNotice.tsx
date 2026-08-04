import type { LicenseInfo } from '@/lib/api/types/digital-products';
import { cn } from '@/lib/utils/cn';
import { isLicenseExpiringSoon } from '@/lib/utils/digital-products';

export function ExpirationNotice({ licenseInfo, className }: { licenseInfo: LicenseInfo | null; className?: string }) {
  if (!licenseInfo?.expiresAt) return null;
  const snapshot = { isValid: licenseInfo.isValid, status: licenseInfo.status, downloadsRemaining: licenseInfo.downloadsRemaining, expiresAt: licenseInfo.expiresAt ?? undefined };
  if (!isLicenseExpiringSoon(snapshot)) return null;
  return <div className={cn('@container rounded-card border border-warning bg-warning-subtle/60 p-4 @md:p-5', className)} role="status" aria-live="polite"><div className="flex flex-col gap-3 @md:flex-row @md:items-center @md:justify-between"><div className="flex items-start gap-3"><span className="material-symbols-outlined text-warning">warning</span><div><p className="text-sm font-semibold text-text-base">License Expiration Notice</p><p className="mt-1 text-sm text-text-muted">Your license is expiring soon. Renew to keep uninterrupted access.</p></div></div><span className="text-sm font-semibold text-warning">Renew License</span></div></div>;
}
