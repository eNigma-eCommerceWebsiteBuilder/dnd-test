import { cn } from '@/lib/utils/cn';

interface PaymentMethodItem {
  id: string;
  name: string;
  icon?: string;
}

interface CheckoutPaymentMethodViewProps {
  title?: string;
  subtitle?: string;
  selectedMethodId?: string;
  methods: PaymentMethodItem[];
  contactEmail?: string;
  className?: string;
}

export const puckComponentName = 'CheckoutPaymentMethod';
export const puckLabel = 'Checkout Payment Method';
export const puckCategory = 'Checkout';

export const puckFields = {
  title: { type: 'text' as const, label: 'Section Title' },
  subtitle: { type: 'text' as const, label: 'Section Subtitle' },
  selectedMethodId: { type: 'text' as const, label: 'Selected Method ID' },
  contactEmail: { type: 'text' as const, label: 'Contact Email (default)' },
  methods: {
    type: 'array' as const,
    label: 'Payment Methods',
    arrayFields: {
      id: { type: 'text' as const, label: 'Method ID' },
      name: { type: 'text' as const, label: 'Method Name' },
      icon: { type: 'text' as const, label: 'Material Icon Name' },
    },
    defaultItemProps: {
      id: 'new-method',
      name: 'New Payment Method',
      icon: 'credit_card',
    },
    getItemSummary: (item: PaymentMethodItem) => item.name,
    max: 6,
  },
};

export const puckDefaults = {
  title: 'Payment',
  subtitle: 'Choose how you want to pay',
  selectedMethodId: 'card',
  contactEmail: '',
  methods: [
    { id: 'card', name: 'Credit Card', icon: 'credit_card' },
    { id: 'paypal', name: 'PayPal', icon: 'account_balance_wallet' },
    { id: 'apple-pay', name: 'Apple Pay', icon: 'nfc' },
  ],
};

export function CheckoutPaymentMethodView({
  title = 'Payment',
  subtitle = 'Choose how you want to pay',
  selectedMethodId = '',
  methods,
  contactEmail = '',
  className,
}: CheckoutPaymentMethodViewProps) {
  return (
    <div className={cn('@container w-full space-y-6', className)}>
      <div>
        <div className="mb-4 @sm:mb-6">
          <h3 className="text-lg @sm:text-xl font-bold text-text-base">Contact Email</h3>
          <p className="text-sm text-text-muted mt-1">We'll send your order confirmation here</p>
        </div>
        <input
          type="email"
          defaultValue={contactEmail}
          placeholder="you@example.com"
          className="w-full rounded-button border border-border bg-bg-surface px-4 py-3 text-sm text-text-base"
        />
      </div>
      <div>
        <div className="mb-4 @sm:mb-6">
          <h3 className="text-lg @sm:text-xl font-bold text-text-base">{title}</h3>
          <p className="text-sm text-text-muted mt-1">{subtitle}</p>
        </div>
        <div className="grid grid-cols-2 @sm:grid-cols-3 gap-3">
          {methods.map((method) => {
            const isSelected = selectedMethodId === method.id;
            return (
              <div
                key={method.id}
                className={cn(
                  'flex flex-col items-center justify-center gap-2 p-3 @sm:p-4 rounded-card border-2 transition-all h-24',
                  isSelected ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-bg-surface text-text-muted',
                )}
              >
                <span className="material-symbols-outlined text-2xl mb-1">{method.icon || 'credit_card'}</span>
                <span className="text-sm font-medium">{method.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
