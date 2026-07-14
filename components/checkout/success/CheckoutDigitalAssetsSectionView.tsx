import type { ReactNode } from 'react';
import { getOrderDigitalAssets } from '@/lib/api/services/orders';
import { CopyButton } from './CopyButton';
import { getSearchParam, type PuckFetcherContext } from '@/lib/puck-route-metadata';

interface DigitalAssetItem {
  productName: string;
  licenseKey?: string;
  downloadCount?: number;
}

interface CheckoutDigitalAssetsSectionViewProps {
  orderId?: string;
  email?: string;
  state?: string;
  assets?: DigitalAssetItem[];
  available?: (props?: Record<string, unknown>) => ReactNode;
  unavailable?: (props?: Record<string, unknown>) => ReactNode;
}

export const puckComponentName = 'CheckoutDigitalAssetsSection';
export const puckLabel = 'Checkout Digital Assets Section';
export const puckCategory = 'Checkout';

export const puckFields = {
  orderId: { type: 'text' as const, label: 'Order ID' },
  email: { type: 'text' as const, label: 'Guest Email' },
  state: {
    type: 'select' as const,
    label: 'Preview State',
    options: [
      { label: 'Available', value: 'available' },
      { label: 'Unavailable', value: 'unavailable' },
    ],
  },
  available: { type: 'slot' as const },
  unavailable: { type: 'slot' as const },
};

export const puckDefaults = {
  orderId: '',
  email: '',
  state: 'available',
};

export const puckAst = {
  kind: 'runtime',
  topLevel: true,
  slots: ['available', 'unavailable'],
  runtimeSignals: ['order', 'digitalAssets'],
  matches: [
    { pageIncludes: ['app/checkout/success/page.tsx'], textIncludes: ['DigitalDownloads', 'LicenseKeyDisplay'], component: 'CheckoutDigitalAssetsSection' },
  ],
};

export async function puckDataFetcher(
  props: { orderId?: string; email?: string },
  context?: PuckFetcherContext,
) {
  const orderId = props.orderId || getSearchParam(context, 'orderId');
  const email = props.email || getSearchParam(context, 'email');

  if (!orderId) return { state: 'unavailable' };

  try {
    const response = await getOrderDigitalAssets(orderId, email || null);
    return {
      assets: response.assets || [],
      email,
      orderId,
      state: response?.hasDigitalItems && response.assets && response.assets.length > 0 ? 'available' : 'unavailable',
    };
  } catch {
    return { email, orderId, state: 'unavailable' };
  }
}

function maskKey(key: string): string {
  if (!key || key.length < 8) return key;
  return `${key.slice(0, 4)}....-....-${key.slice(-4)}`;
}

export function CheckoutDigitalAssetsSectionView({ state = 'available', assets = [], available, unavailable }: CheckoutDigitalAssetsSectionViewProps) {
  if (state !== 'available') return <>{unavailable?.()}</>;

  if (assets.length > 0) {
    return (
      <div className="space-y-4">
        <div className="rounded-card border border-border bg-bg-surface p-4 shadow-card md:p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">download</span>
            <h3 className="font-bold text-text-base">Digital Items &amp; Assets</h3>
          </div>
          <div className="space-y-4">
            {assets.map((asset, index) => (
              <div key={`${asset.productName}-${index}`} className="border-b border-divider pb-4 last:border-0 last:pb-0">
                <div className="mb-2 flex flex-col justify-between gap-3 md:flex-row md:items-center">
                  <span className="font-semibold text-text-base">{asset.productName}</span>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-button-sm bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/20"
                  >
                    <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                    Download File
                  </button>
                </div>
                <div className="flex gap-4 text-xs text-text-muted">
                  <span>License: End User</span>
                  {Number(asset.downloadCount || 0) > 0 ? <span>Downloaded {asset.downloadCount} times</span> : null}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-card border border-border bg-bg-surface p-4 shadow-card md:p-6">
          <h3 className="mb-4 font-bold text-text-base">License Keys</h3>
          {assets.map((asset, index) => (
            <div key={`${asset.licenseKey || asset.productName}-${index}`} className="mb-3 rounded-card-sm border border-divider bg-bg-sunken p-3 md:p-4">
              <div className="mb-1 flex items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-wider text-text-muted">
                  {asset.productName} License
                </p>
                {asset.licenseKey ? <CopyButton text={asset.licenseKey} /> : null}
              </div>
              {asset.licenseKey ? (
                <p className="break-all font-mono text-xs font-semibold text-text-base md:text-sm">
                  {maskKey(asset.licenseKey)}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return <>{available?.()}</>;
}
