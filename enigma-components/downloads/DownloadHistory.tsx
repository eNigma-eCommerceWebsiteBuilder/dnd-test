'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { DownloadStats, LicenseInfo } from '@/lib/api/types/digital-products';
import { checkMultipleLicensesAction } from '@/lib/actions/digital-products-actions';
import { useDownloadStats } from '@/lib/hooks';
import { getLicenseStatusBadge } from '@/lib/utils/digital-products';

interface DownloadHistoryEntry {
    licenseKey: string;
    licenseInfo: LicenseInfo;
    downloadStats: DownloadStats;
}

interface DownloadHistoryProps {
    entries: DownloadHistoryEntry[];
}

interface StatusBadgeProps {
    label: string;
    tone: 'green' | 'yellow' | 'red' | 'gray';
}

const STATUS_TONE_CLASSES: Record<StatusBadgeProps['tone'], string> = {
    green: 'border-success bg-success-subtle text-success',
    yellow: 'border-warning bg-warning-subtle text-warning',
    red: 'border-danger bg-danger-subtle text-danger',
    gray: 'border-border bg-bg-elevated text-text-muted',
};

function StatusBadge({ label, tone }: StatusBadgeProps) {
    return (
        <span
            className={`@container inline-flex items-center rounded-badge border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${STATUS_TONE_CLASSES[tone]}`}
        >
            {label}
        </span>
    );
}

interface HistoryRowProps {
    entry: DownloadHistoryEntry;
    refreshToken: number;
    onStatsUpdate: (licenseKey: string, stats: DownloadStats) => void;
}

function DownloadHistoryRow({ entry, refreshToken, onStatsUpdate }: HistoryRowProps) {
    const { stats, loadStats } = useDownloadStats();

    useEffect(() => {
        loadStats(entry.licenseKey);
    }, [entry.licenseKey, loadStats, refreshToken]);

    const activeStats = stats ?? entry.downloadStats;

    useEffect(() => {
        if (stats) {
            onStatsUpdate(entry.licenseKey, stats);
        }
    }, [entry.licenseKey, onStatsUpdate, stats]);

    const badge = getLicenseStatusBadge({
        isValid: entry.licenseInfo.isValid,
        status: entry.licenseInfo.status,
        downloadsRemaining: entry.licenseInfo.downloadsRemaining,
        expiresAt: entry.licenseInfo.expiresAt ?? undefined,
    });

    return (
        <tr className="@container hover:bg-bg-hover">
            <td className="px-6 py-4 font-semibold text-text-base">
                {entry.licenseInfo.assetName}
            </td>
            <td className="px-6 py-4 text-text-muted">
                {activeStats.lastAccessedAt ?? 'Not downloaded'}
            </td>
            <td className="px-6 py-4 text-text-muted">
                {activeStats.downloadCount}
            </td>
            <td className="px-6 py-4">
                <StatusBadge label={badge.label} tone={badge.color as StatusBadgeProps['tone']} />
            </td>
        </tr>
    );
}

export function DownloadHistory({ entries }: DownloadHistoryProps) {
    const [historyEntries, setHistoryEntries] = useState<DownloadHistoryEntry[]>(entries);
    const [refreshToken, setRefreshToken] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const licenseKeys = useMemo(() => historyEntries.map((entry) => entry.licenseKey), [historyEntries]);

    const handleRefresh = useCallback(async () => {
        if (licenseKeys.length === 0) {
            return;
        }

        setRefreshing(true);
        setError(null);

        const result = await checkMultipleLicensesAction(licenseKeys);
        if (!result.success || !result.data) {
            setError(result.error || 'Unable to refresh download history.');
            setRefreshing(false);
            return;
        }

        setHistoryEntries((prev) => prev.map((entry) => {
            const updated = result.data?.[entry.licenseKey];
            if (!updated?.license) {
                return entry;
            }

            return {
                ...entry,
                licenseInfo: updated.license,
            };
        }));
        setRefreshToken((prev) => prev + 1);
        setRefreshing(false);
    }, [licenseKeys]);

    const handleStatsUpdate = useCallback((licenseKey: string, stats: DownloadStats) => {
        setHistoryEntries((prev) => prev.map((entry) => {
            if (entry.licenseKey !== licenseKey) {
                return entry;
            }

            return {
                ...entry,
                downloadStats: stats,
            };
        }));
    }, []);

    return (
        <section className="@container rounded-card border border-border bg-bg-surface shadow-card">
            <div className="flex flex-col gap-3 border-b border-divider px-6 py-4 @md:flex-row @md:items-center @md:justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-text-base">Download History</h2>
                    <p className="text-sm text-text-muted">Recent digital asset activity</p>
                </div>
                <button
                    type="button"
                    onClick={handleRefresh}
                    className="text-sm font-semibold text-primary transition hover:text-primary/80 disabled:opacity-60"
                    disabled={refreshing}
                >
                    {refreshing ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>
            {error ? (
                <div className="px-6 py-3 text-sm text-danger" role="status">
                    {error}
                </div>
            ) : null}
            <div className="w-full overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="bg-bg-elevated text-text-muted">
                            <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.3em]">Asset</th>
                            <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.3em]">Last Access</th>
                            <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.3em]">Downloads</th>
                            <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.3em]">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-divider">
                        {historyEntries.length === 0 ? (
                            <tr>
                                <td className="px-6 py-6 text-sm text-text-muted" colSpan={4}>
                                    No download activity yet.
                                </td>
                            </tr>
                        ) : (
                            historyEntries.slice(0, 5).map((entry) => (
                                <DownloadHistoryRow
                                    key={`history-${entry.licenseKey}`}
                                    entry={entry}
                                    refreshToken={refreshToken}
                                    onStatsUpdate={handleStatsUpdate}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className="flex items-center justify-center border-t border-divider bg-bg-elevated/60 px-6 py-4">
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-text-muted">
                    View Full History
                </span>
            </div>
        </section>
    );
}
