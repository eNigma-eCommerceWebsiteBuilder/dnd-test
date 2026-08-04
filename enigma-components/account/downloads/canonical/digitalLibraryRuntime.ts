import { getMyOrders, getOrderDigitalAssets } from '@/lib/api/services/orders';
import { getDownloadStats, getLicenseInfo } from '@/lib/api/services/digital-products';
import type { DownloadStats, LicenseInfo } from '@/lib/api/types/digital-products';

export interface DigitalLibraryEntry {
    licenseKey: string;
    licenseInfo: LicenseInfo;
    downloadStats: DownloadStats;
    downloadLimit: number | null;
}

export interface DigitalLibraryPageData {
    currentTimeMs: number;
    entries: DigitalLibraryEntry[];
}

export interface DigitalLibraryMetrics {
    totalDownloadsRemaining: number;
    hasUnlimitedDownloads: boolean;
    totalDownloadsUsed: number;
    expiringSoonCount: number;
    attentionCopy: string;
}

// Keep the page's paid-asset and license enrichment flow in one source-owned loader.
export async function fetchDigitalLibraryPageData(): Promise<DigitalLibraryPageData> {
    const ordersResponse = await getMyOrders();
    const orders = ordersResponse?.data ?? [];

    const assetsByOrder = await Promise.all(
        orders.map(async (order) => {
            const response = await getOrderDigitalAssets(order._id);
            if (!response?.hasDigitalItems || !response.assets || response.assets.length === 0) {
                return [];
            }
            if (!response.isPaid) {
                return [];
            }
            return response.assets;
        })
    );

    const entries = await Promise.all(
        assetsByOrder.flat().map(async (asset) => {
            const [licenseInfo, downloadStats] = await Promise.all([
                getLicenseInfo(asset.licenseKey),
                getDownloadStats(asset.licenseKey),
            ]);

            return {
                licenseKey: asset.licenseKey,
                licenseInfo,
                downloadStats,
                downloadLimit: Number.isFinite(asset.maxDownloads) ? asset.maxDownloads : null,
            };
        })
    );

    return {
        currentTimeMs: Date.now(),
        entries,
    };
}

export function getDigitalLibraryMetrics(
    { currentTimeMs, entries }: DigitalLibraryPageData,
): DigitalLibraryMetrics {
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

    return {
        totalDownloadsRemaining,
        hasUnlimitedDownloads,
        totalDownloadsUsed,
        expiringSoonCount,
        attentionCopy: expiringSoonCount > 0
            ? `${expiringSoonCount} item${expiringSoonCount === 1 ? '' : 's'} expiring soon`
            : 'No urgent expirations',
    };
}
