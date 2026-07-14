import { cn } from '@/lib/utils/cn';

interface CheckoutShippingFormViewProps {
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  fullName?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  className?: string;
}

export const puckComponentName = 'CheckoutShippingForm';
export const puckLabel = 'Checkout Shipping Form';
export const puckCategory = 'Checkout';

export const puckFields = {
  title: { type: 'text' as const, label: 'Section Title' },
  subtitle: { type: 'text' as const, label: 'Section Subtitle' },
  submitLabel: { type: 'text' as const, label: 'Submit Button Label' },
  fullName: { type: 'text' as const, label: 'Default Full Name' },
  addressLine1: { type: 'text' as const, label: 'Default Address Line 1' },
  addressLine2: { type: 'text' as const, label: 'Default Address Line 2' },
  city: { type: 'text' as const, label: 'Default City' },
  state: { type: 'text' as const, label: 'Default State' },
  postalCode: { type: 'text' as const, label: 'Default Postal Code' },
  country: { type: 'text' as const, label: 'Default Country' },
  phone: { type: 'text' as const, label: 'Default Phone' },
};

export const puckDefaults = {
  title: 'Shipping Address',
  subtitle: 'Where should we deliver your order?',
  submitLabel: 'Continue to Payment',
  fullName: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'United States',
  phone: '',
};

export function CheckoutShippingFormView({
  title = 'Shipping Address',
  subtitle = 'Where should we deliver your order?',
  submitLabel = 'Continue to Payment',
  fullName = '',
  addressLine1 = '',
  addressLine2 = '',
  city = '',
  state = '',
  postalCode = '',
  country = 'United States',
  phone = '',
  className,
}: CheckoutShippingFormViewProps) {
  return (
    <div className={cn('@container w-full', className)}>
      <div className="mb-4 @sm:mb-6">
        <h3 className="text-lg @sm:text-xl font-bold text-text-base">{title}</h3>
        <p className="text-sm text-text-muted mt-1">{subtitle}</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">Full Name</label>
          <input type="text" defaultValue={fullName} className="w-full rounded-button border border-border bg-bg-surface px-4 py-3 text-sm text-text-base" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">Address Line 1</label>
          <input type="text" defaultValue={addressLine1} className="w-full rounded-button border border-border bg-bg-surface px-4 py-3 text-sm text-text-base" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">Address Line 2 (optional)</label>
          <input type="text" defaultValue={addressLine2} className="w-full rounded-button border border-border bg-bg-surface px-4 py-3 text-sm text-text-base" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">City</label>
            <input type="text" defaultValue={city} className="w-full rounded-button border border-border bg-bg-surface px-4 py-3 text-sm text-text-base" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">State / Province</label>
            <input type="text" defaultValue={state} className="w-full rounded-button border border-border bg-bg-surface px-4 py-3 text-sm text-text-base" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">Postal Code</label>
            <input type="text" defaultValue={postalCode} className="w-full rounded-button border border-border bg-bg-surface px-4 py-3 text-sm text-text-base" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">Country</label>
            <input type="text" defaultValue={country} className="w-full rounded-button border border-border bg-bg-surface px-4 py-3 text-sm text-text-base" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">Phone (optional)</label>
          <input type="tel" defaultValue={phone} className="w-full rounded-button border border-border bg-bg-surface px-4 py-3 text-sm text-text-base" />
        </div>
        <button
          type="button"
          className="w-full rounded-button bg-cta-primary px-6 py-4 text-sm font-bold text-on-primary shadow-button transition-all hover:bg-cta-primary-hover hover:-translate-y-0.5 hover:shadow-button-hover"
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
}
