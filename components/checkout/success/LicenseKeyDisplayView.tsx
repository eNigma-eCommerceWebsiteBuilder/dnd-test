import { cn } from '@/lib/utils/cn';
import { CopyButton } from './CopyButton';

interface LicenseKeyDisplayViewProps {
  licenseKey: string;
  productName: string;
  className?: string;
}

export const puckComponentName = 'LicenseKeyDisplay';
export const puckLabel = 'License Key Display';
export const puckCategory = 'Checkout';

export const puckFields = {
  licenseKey: { type: 'text' as const, label: 'License Key' },
  productName: { type: 'text' as const, label: 'Product Name' },
};

export const puckDefaults = {
  licenseKey: 'ABCD-1234-EFGH-5678',
  productName: 'Digital Product',
};


function maskKey(key: string): string {
  if (!key || key.length < 8) return key;
  return `${key.slice(0, 4)}••••-••••-${key.slice(-4)}`;
}

export function LicenseKeyDisplayView({ licenseKey, productName, className }: LicenseKeyDisplayViewProps) {
  return (
    <div className={cn('@container', className)}>
      <div className="mb-3 rounded-card-sm border border-divider bg-bg-sunken p-3 @md:p-4">
        <div className="mb-1 flex items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-wider text-text-muted">
            {productName} License
          </p>
          <CopyButton text={licenseKey} />
        </div>
        <p className="break-all font-mono text-xs font-semibold text-text-base @md:text-sm">
          {maskKey(licenseKey)}
        </p>
      </div>
    </div>
  );
}
