import type { DownloadStats, LicenseInfo } from '@/lib/api/types/digital-products';
import { maskLicenseKey } from '@/lib/utils/digital-products';
import { DownloadsRemaining } from '@/components/account/downloads/DownloadsRemaining';
import { ExpirationNotice } from '@/components/account/downloads/ExpirationNotice';
import { LicenseStatusBadge } from '@/components/account/downloads/LicenseStatusBadge';
import { DownloadButton } from '@/components/account/downloads/DownloadButton';

interface DigitalProductCardProps {
    licenseKey: string;
    licenseInfo: LicenseInfo;
    downloadStats: DownloadStats;
    downloadLimit: number | null;
}

export function DigitalProductCard({ licenseKey, licenseInfo, downloadStats, downloadLimit }: DigitalProductCardProps) {
    return (
        <article className="@container flex h-full w-full flex-col overflow-hidden rounded-card border border-border bg-bg-surface shadow-card">
            <div className="relative h-40 w-full bg-bg-sunken">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-bg-surface" />
                <div className="absolute left-4 top-4">
                    <LicenseStatusBadge status={licenseInfo.status} />
                </div>
            </div>
            <div className="flex flex-1 flex-col gap-4 p-5">
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-text-base">{licenseInfo.assetName}</h3>
                    <p className="text-sm text-text-muted">{licenseInfo.mimeType}</p>
                </div>

                <div className="rounded-card border border-divider bg-bg-elevated px-3 py-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-text-muted">
                        License Key
                    </p>
                    <p className="text-sm font-mono text-text-base">{maskLicenseKey(licenseKey)}</p>
                </div>

                <div className="flex flex-col gap-3">
                    <DownloadsRemaining
                        licenseInfo={licenseInfo}
                        downloadCount={downloadStats.downloadCount}
                        downloadLimit={downloadLimit}
                    />
                    <ExpirationNotice licenseInfo={licenseInfo} />
                </div>

                <DownloadButton
                    licenseKey={licenseKey}
                    initialLicenseInfo={licenseInfo}
                    downloadLimit={downloadLimit}
                />
            </div>
        </article>
    );
}
