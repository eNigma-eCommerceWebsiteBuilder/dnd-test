import { cn } from '@/lib/utils/cn';

interface DigitalAssetItem {
  productName: string;
  licenseKey: string;
  downloadCount: number;
}

interface DigitalDownloadsViewProps {
  assets: DigitalAssetItem[];
  className?: string;
}

export const puckComponentName = 'DigitalDownloads';
export const puckLabel = 'Digital Downloads';
export const puckCategory = 'Checkout';

export const puckFields = {
  assets: {
    type: 'array' as const,
    label: 'Digital Assets',
    arrayFields: {
      productName: { type: 'text' as const, label: 'Product Name' },
      licenseKey: { type: 'text' as const, label: 'License Key' },
      downloadCount: { type: 'number' as const, label: 'Download Count' },
    },
    defaultItemProps: {
      productName: 'Digital Product',
      licenseKey: 'XXXX-XXXX-XXXX-XXXX',
      downloadCount: 0,
    },
    getItemSummary: (item: DigitalAssetItem) => item.productName,
  },
};

export const puckDefaults = {
  assets: [
    { productName: 'Digital Lookbook PDF', licenseKey: 'ABCD-1234-EFGH-5678', downloadCount: 0 },
  ],
};


export function DigitalDownloadsView({ assets, className }: DigitalDownloadsViewProps) {
  if (!assets || assets.length === 0) return null;

  return (
    <div className={cn('@container', className)}>
      <div className="rounded-card border border-border bg-bg-surface p-4 shadow-card @md:p-6">
        <div className="mb-4 flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">download</span>
          <h3 className="font-bold text-text-base">Digital Items &amp; Assets</h3>
        </div>
        <div className="space-y-4">
          {assets.map((asset, idx) => (
            <div key={idx} className="border-b border-divider pb-4 last:border-0 last:pb-0">
              <div className="mb-2 flex flex-col justify-between gap-3 @md:flex-row @md:items-center">
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
                {asset.downloadCount > 0 && (
                  <span>Downloaded {asset.downloadCount} times</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
