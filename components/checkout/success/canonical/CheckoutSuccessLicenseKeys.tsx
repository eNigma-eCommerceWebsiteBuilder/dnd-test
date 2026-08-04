import type { DigitalAsset } from '@/lib/api/types';
import { LicenseKeyDisplay } from '@/components/checkout/success/LicenseKeyDisplay';

export function CheckoutSuccessLicenseKeys({ assets }: { assets: DigitalAsset[] }) {
  return (
    <div className="bg-bg-surface rounded-card p-4 md:p-6 shadow-card border border-border">
      <h3 className="font-bold text-text-base mb-4">License Keys</h3>
      {assets.map((asset, idx) => (
        <LicenseKeyDisplay
          key={asset.licenseKey || idx}
          licenseKey={asset.licenseKey}
          productName={asset.productName}
        />
      ))}
    </div>
  );
}
