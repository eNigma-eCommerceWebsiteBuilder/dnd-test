import type { LicenseInfo } from '@/lib/api/types/digital-products';
import { getExpiryInfo } from '@/lib/utils/digital-products';

interface ExpirationNoticeProps {
    licenseInfo: LicenseInfo;
}

export function ExpirationNotice({ licenseInfo }: ExpirationNoticeProps) {
    const expiryInfo = getExpiryInfo({
        isValid: licenseInfo.isValid,
        status: licenseInfo.status,
        downloadsRemaining: licenseInfo.downloadsRemaining,
        expiresAt: licenseInfo.expiresAt ?? undefined,
    });
    if (!licenseInfo.expiresAt || (!expiryInfo.isExpired && !expiryInfo.isExpiringSoon)) {
        return null;
    }

    return (
        <div className="@container inline-flex items-center gap-2 rounded-card border border-warning bg-warning-subtle/60 px-3 py-2 text-xs text-warning">
            <span className="material-symbols-outlined text-sm">warning</span>
            <span className="font-semibold">{expiryInfo.displayText}</span>
        </div>
    );
}
