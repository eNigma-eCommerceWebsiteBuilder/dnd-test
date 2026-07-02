import type { LicenseInfo } from '@/lib/api/types/digital-products';
import { formatDownloadsRemaining, getDownloadInfo } from '@/lib/utils/digital-products';

interface DownloadsRemainingProps {
    licenseInfo: LicenseInfo;
    downloadCount: number;
    downloadLimit: number | null;
}

export function DownloadsRemaining({ licenseInfo, downloadCount, downloadLimit }: DownloadsRemainingProps) {
    const licenseSnapshot = {
        isValid: licenseInfo.isValid,
        status: licenseInfo.status,
        downloadsRemaining: licenseInfo.downloadsRemaining,
        downloadLimit,
        expiresAt: licenseInfo.expiresAt ?? undefined,
    };
    const downloadInfo = getDownloadInfo(licenseSnapshot);
    const remainingLabel = downloadInfo.unlimited
        ? 'Unlimited'
        : (downloadInfo.remaining ?? 0).toString();
    const summaryText = formatDownloadsRemaining(licenseSnapshot);

    return (
        <div className="@container w-full space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-text-muted">
                Downloads Remaining
            </p>
            <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-text-base">{remainingLabel}</span>
                <span className="text-xs text-text-muted">used {downloadCount}</span>
            </div>
            <p className="text-xs text-text-muted">{summaryText}</p>
        </div>
    );
}
