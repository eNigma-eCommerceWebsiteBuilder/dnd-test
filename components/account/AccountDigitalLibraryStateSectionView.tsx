import { getLicenseInfo, getDownloadStats } from '@/lib/api/services/digital-products';
import { getMyOrders, getOrderDigitalAssets } from '@/lib/api/services/orders';
import type { DownloadStats, LicenseInfo } from '@/lib/api/types/digital-products';
import { DigitalLibrary } from '@/components/account/downloads/DigitalLibrary';

interface DigitalLibraryEntry {
  licenseKey: string;
  licenseInfo: LicenseInfo;
  downloadStats: DownloadStats;
  downloadLimit: number | null;
}

interface AccountDigitalLibraryStateSectionViewProps {
  state?: 'content' | 'empty' | 'error';
  currentTimeMs?: number;
  entries?: DigitalLibraryEntry[];
  errorMessage?: string;
}

export const puckComponentName = 'AccountDigitalLibraryStateSection';
export const puckLabel = 'Account Digital Library State Section';
export const puckCategory = 'Account';

export const puckFields = {
  state: {
    type: 'select' as const,
    label: 'Preview State',
    options: [
      { label: 'Content', value: 'content' },
      { label: 'Empty', value: 'empty' },
      { label: 'Error', value: 'error' },
    ],
  },
};

export const puckDefaults = {
  state: 'empty',
};

export const puckAst = {
  kind: 'runtime',
  topLevel: true,
  runtimeSignals: ['orders', 'digitalAssets', 'licenseInfo', 'downloadStats'],
  matches: [
    { pageIncludes: ['app/account/downloads/page.tsx'], component: 'AccountDigitalLibraryStateSection' },
  ],
};

export async function puckDataFetcher() {
  try {
    const ordersResponse = await getMyOrders();
    const orders = ordersResponse?.data || [];
    const assetsByOrder = await Promise.all(
      orders.map(async (order) => {
        const response = await getOrderDigitalAssets(order._id);
        if (!response?.hasDigitalItems || !response.assets?.length || !response.isPaid) return [];
        return response.assets;
      }),
    );
    const assets = assetsByOrder.flat();
    const entries = await Promise.all(
      assets.map(async (asset) => {
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
      }),
    );

    return {
      currentTimeMs: Date.now(),
      entries,
      state: entries.length > 0 ? 'content' : 'empty',
    };
  } catch (error) {
    return {
      state: 'error',
      errorMessage: error instanceof Error ? error.message : 'Unable to load digital library.',
    };
  }
}

export function AccountDigitalLibraryStateSectionView({
  state = 'empty',
  currentTimeMs = 0,
  entries = [],
  errorMessage = 'Unable to load digital library.',
}: AccountDigitalLibraryStateSectionViewProps) {
  return (
    <main className="min-h-screen bg-bg-base text-text-base">
      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 md:py-12 lg:px-12">
        {state === 'error' ? (
          <div className="rounded-card border border-danger bg-danger-subtle p-6 text-danger">{errorMessage}</div>
        ) : (
          <DigitalLibrary currentTimeMs={currentTimeMs} entries={entries} />
        )}
      </div>
    </main>
  );
}
