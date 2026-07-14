import { cn } from '@/lib/utils/cn';

interface ShippingInfoViewProps {
  customerName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  className?: string;
}

export const puckComponentName = 'ShippingInfo';
export const puckLabel = 'Shipping Info';
export const puckCategory = 'Checkout';

export const puckFields = {
  customerName: { type: 'text' as const, label: 'Customer Name' },
  street: { type: 'text' as const, label: 'Street Address' },
  city: { type: 'text' as const, label: 'City' },
  state: { type: 'text' as const, label: 'State' },
  zipCode: { type: 'text' as const, label: 'Zip Code' },
  country: { type: 'text' as const, label: 'Country' },
};

export const puckDefaults = {
  customerName: 'John Doe',
  street: '123 Fashion Ave',
  city: 'New York',
  state: 'NY',
  zipCode: '10001',
  country: 'United States',
};


export function ShippingInfoView({
  customerName,
  street,
  city,
  state,
  zipCode,
  country,
  className,
}: ShippingInfoViewProps) {
  return (
    <div className={cn('@container', className)}>
      <div className="rounded-card border border-border bg-bg-surface p-4 shadow-card @md:p-6">
        <div className="mb-4 flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">local_shipping</span>
          <h3 className="font-bold text-text-base">Shipping &amp; Delivery</h3>
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-medium text-text-base">Standard Shipping</p>
          <div className="text-text-muted">
            <p>{customerName}</p>
            <p>{street}</p>
            <p>{city}, {state} {zipCode}</p>
            <p>{country}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
