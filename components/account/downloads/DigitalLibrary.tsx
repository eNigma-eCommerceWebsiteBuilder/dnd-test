import type { DownloadStats, LicenseInfo } from '@/lib/api/types/digital-products';
import { DigitalProductCard } from '@/components/account/downloads/DigitalProductCard';
import { EmptyDownloads } from '@/components/account/downloads/EmptyDownloads';
import { DownloadHistory } from '@/components/account/downloads/DownloadHistory';

interface DigitalLibraryEntry {
    licenseKey: string;
    licenseInfo: LicenseInfo;
    downloadStats: DownloadStats;
    downloadLimit: number | null;
}

interface DigitalLibraryProps {
    currentTimeMs: number;
    entries: DigitalLibraryEntry[];
}

export function DigitalLibrary({ currentTimeMs, entries }: DigitalLibraryProps) {
    const totalDownloadsRemaining = entries.reduce((total, entry) => {
        if (entry.downloadStats.downloadsRemaining === null) {
            return total;
        }
        return total + entry.downloadStats.downloadsRemaining;
    }, 0);

    const hasUnlimitedDownloads = entries.some((entry) => entry.downloadLimit === null);
    const totalDownloadsUsed = entries.reduce((total, entry) => total + entry.downloadStats.downloadCount, 0);

    const expiringSoonCount = entries.filter((entry) => {
        if (!entry.licenseInfo.expiresAt) {
            return false;
        }
        const expiresAt = new Date(entry.licenseInfo.expiresAt).getTime();
        const diffMs = expiresAt - currentTimeMs;
        return diffMs > 0 && diffMs <= 1000 * 60 * 60 * 48;
    }).length;

    const attentionCopy = expiringSoonCount > 0
        ? `${expiringSoonCount} item${expiringSoonCount === 1 ? '' : 's'} expiring soon`
        : 'No urgent expirations';

    return (
        <section className="@container relative w-full space-y-8">
            <div className="rounded-card border border-border bg-bg-surface p-6 shadow-card">
                <div className="flex flex-col gap-4 @md:flex-row @md:items-center @md:justify-between">
                    <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-text-muted">Account</p>
                        <h1 className="text-3xl font-heading font-bold text-text-base">Digital Library</h1>
                        <p className="text-sm text-text-muted">
                            Manage your professional digital assets and software licenses.
                        </p>
                    </div>
                    <div className="rounded-card border border-border bg-bg-elevated px-4 py-3 shadow-card">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-text-muted">
                            Storage usage
                        </p>
                        <p className="text-sm font-semibold text-text-base">Usage unavailable</p>
                    </div>
                </div>
            </div>

            <div className="grid w-full grid-cols-1 gap-6 @md:grid-cols-2 @xl:grid-cols-3">
                <div className="rounded-card border border-border bg-bg-surface p-5 shadow-card">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-card bg-success-subtle text-success">
                            <span className="material-symbols-outlined text-lg">file_download</span>
                        </div>
                        <div className="@container w-full space-y-2">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-text-muted">
                                Downloads Remaining
                            </p>
                            <p className="text-2xl font-bold text-text-base">
                                {hasUnlimitedDownloads ? 'Unlimited' : totalDownloadsRemaining}
                            </p>
                            <p className="text-xs text-text-muted">used {totalDownloadsUsed}</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-card border border-border bg-bg-surface p-5 shadow-card">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-card bg-warning-subtle text-warning">
                            <span className="material-symbols-outlined text-lg">event_busy</span>
                        </div>
                        <div className="@container w-full space-y-2">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-text-muted">
                                Attention required
                            </p>
                            <p className="text-2xl font-bold text-text-base">{expiringSoonCount}</p>
                            <p className="text-xs text-text-muted">{attentionCopy}</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-card border border-border bg-bg-surface p-5 shadow-card">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-card bg-primary/10 text-primary">
                            <span className="material-symbols-outlined text-lg">inventory_2</span>
                        </div>
                        <div className="@container w-full space-y-2">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-text-muted">
                                Total assets
                            </p>
                            <p className="text-2xl font-bold text-text-base">{entries.length}</p>
                            <p className="text-xs text-text-muted">Available in your library</p>
                        </div>
                    </div>
                </div>
            </div>

            {entries.length === 0 ? (
                <EmptyDownloads />
            ) : (
                <div className="grid w-full grid-cols-1 gap-6 @md:grid-cols-2 @xl:grid-cols-3">
                    {entries.map((entry) => (
                        <DigitalProductCard
                            key={entry.licenseKey}
                            licenseKey={entry.licenseKey}
                            licenseInfo={entry.licenseInfo}
                            downloadStats={entry.downloadStats}
                            downloadLimit={entry.downloadLimit}
                        />
                    ))}
                </div>
            )}

            <DownloadHistory
                entries={entries.map((entry) => ({
                    licenseKey: entry.licenseKey,
                    licenseInfo: entry.licenseInfo,
                    downloadStats: entry.downloadStats,
                }))}
            />

            <div className="pointer-events-none absolute inset-0 -z-10 opacity-40" aria-hidden>
                <div className="absolute left-[5%] top-[10%] h-64 w-64 rounded-full bg-primary/10 blur-[120px]" />
                <div className="absolute bottom-[5%] right-[5%] h-56 w-56 rounded-full bg-accent/10 blur-[100px]" />
            </div>
        </section>
    );
}
