import type { ReactNode } from 'react';
import { DigitalProductCard } from '@/components/account/downloads/DigitalProductCard';
import { EmptyDownloads } from '@/components/account/downloads/EmptyDownloads';
import { DownloadHistory } from '@/components/account/downloads/DownloadHistory';
import type { DigitalLibraryEntry, DigitalLibraryMetrics } from './digitalLibraryRuntime';

interface RegionProps {
    children?: ReactNode;
}

export function AccountDownloadsPageLayout({ children }: RegionProps) {
    return (
        <main className="min-h-screen bg-bg-base text-text-base">
            <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12 py-8 md:py-12">
                {children}
            </div>
        </main>
    );
}

interface DigitalLibraryLayoutProps {
    header?: ReactNode;
    metrics?: ReactNode;
    assets?: ReactNode;
    history?: ReactNode;
    background?: ReactNode;
}

export function DigitalLibraryLayout({ header, metrics, assets, history, background }: DigitalLibraryLayoutProps) {
    return (
        <section className="@container relative w-full space-y-8">
            {header}
            {metrics}
            {assets}
            {history}
            {background}
        </section>
    );
}

export function DigitalLibraryHeader() {
    return (
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
    );
}

export function DigitalLibraryMetricsLayout({ children }: RegionProps) {
    return <div className="grid w-full grid-cols-1 gap-6 @md:grid-cols-2 @xl:grid-cols-3">{children}</div>;
}

interface MetricsProps {
    metrics: DigitalLibraryMetrics;
    entriesCount: number;
}

export function DigitalLibraryDownloadsMetric({ metrics }: MetricsProps) {
    return (
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
                        {metrics.hasUnlimitedDownloads ? 'Unlimited' : metrics.totalDownloadsRemaining}
                    </p>
                    <p className="text-xs text-text-muted">used {metrics.totalDownloadsUsed}</p>
                </div>
            </div>
        </div>
    );
}

export function DigitalLibraryAttentionMetric({ metrics }: MetricsProps) {
    return (
        <div className="rounded-card border border-border bg-bg-surface p-5 shadow-card">
            <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-card bg-warning-subtle text-warning">
                    <span className="material-symbols-outlined text-lg">event_busy</span>
                </div>
                <div className="@container w-full space-y-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-text-muted">
                        Attention required
                    </p>
                    <p className="text-2xl font-bold text-text-base">{metrics.expiringSoonCount}</p>
                    <p className="text-xs text-text-muted">{metrics.attentionCopy}</p>
                </div>
            </div>
        </div>
    );
}

export function DigitalLibraryAssetsMetric({ entriesCount }: Pick<MetricsProps, 'entriesCount'>) {
    return (
        <div className="rounded-card border border-border bg-bg-surface p-5 shadow-card">
            <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-card bg-primary/10 text-primary">
                    <span className="material-symbols-outlined text-lg">inventory_2</span>
                </div>
                <div className="@container w-full space-y-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-text-muted">
                        Total assets
                    </p>
                    <p className="text-2xl font-bold text-text-base">{entriesCount}</p>
                    <p className="text-xs text-text-muted">Available in your library</p>
                </div>
            </div>
        </div>
    );
}

interface DigitalLibraryAssetsStateProps {
    entries: DigitalLibraryEntry[];
    assets?: ReactNode;
    empty?: ReactNode;
}

export function DigitalLibraryAssetsState({ entries, assets, empty }: DigitalLibraryAssetsStateProps) {
    return entries.length === 0 ? empty : assets;
}

interface EntriesProps {
    entries: DigitalLibraryEntry[];
}

export function DigitalLibraryEntriesGrid({ entries }: EntriesProps) {
    return (
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
    );
}

export function DigitalLibraryEmptyRegion() {
    return <EmptyDownloads />;
}

export function DigitalLibraryHistoryRegion({ entries }: EntriesProps) {
    return (
        <DownloadHistory
            entries={entries.map((entry) => ({
                licenseKey: entry.licenseKey,
                licenseInfo: entry.licenseInfo,
                downloadStats: entry.downloadStats,
            }))}
        />
    );
}

export function DigitalLibraryBackground() {
    return (
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-40" aria-hidden>
            <div className="absolute left-[5%] top-[10%] h-64 w-64 rounded-full bg-primary/10 blur-[120px]" />
            <div className="absolute bottom-[5%] right-[5%] h-56 w-56 rounded-full bg-accent/10 blur-[100px]" />
        </div>
    );
}
