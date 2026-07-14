import { cn } from '@/lib/utils/cn';

interface ShippingAddressViewProps {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  phone?: string;
  className?: string;
}

export const puckComponentName = 'ShippingAddress';
export const puckLabel = 'Shipping Address';
export const puckCategory = 'Account';

export const puckFields = {
  street: { type: 'text' as const, label: 'Street Address' },
  city: { type: 'text' as const, label: 'City' },
  state: { type: 'text' as const, label: 'State / Province' },
  zipCode: { type: 'text' as const, label: 'Postal / ZIP Code' },
  country: { type: 'text' as const, label: 'Country' },
  phone: { type: 'text' as const, label: 'Phone (optional)' },
};

export const puckDefaults = {
  street: '123 Main Street, Apt 4B',
  city: 'New York',
  state: 'NY',
  zipCode: '10001',
  country: 'United States',
  phone: '+1 (555) 123-4567',
};

export function ShippingAddressView({ street = '', city = '', state = '', zipCode = '', country = '', phone = '', className }: ShippingAddressViewProps) {
  return (
    <div className={cn('@container bg-bg-surface rounded-card p-4 @md:p-6 shadow-card border border-border', className)}>
      <div className="flex items-center gap-2 mb-3">
        <span className="material-symbols-outlined text-primary">local_shipping</span>
        <h3 className="text-sm @md:text-base font-bold text-text-base">Shipping Address</h3>
      </div>
      <div className="text-sm @md:text-base text-text-muted leading-relaxed space-y-1">
        <p className="text-text-base font-medium">{street}</p>
        <p>{city}{city && state ? ', ' : ''}{state} {zipCode}</p>
        <p>{country}</p>
        {phone && <p>{phone}</p>}
      </div>
    </div>
  );
}
