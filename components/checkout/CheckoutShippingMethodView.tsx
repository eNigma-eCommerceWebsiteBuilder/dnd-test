import { cn } from '@/lib/utils/cn';

interface ShippingMethodItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  estimatedDays: string;
}

interface CheckoutShippingMethodViewProps {
  title?: string;
  subtitle?: string;
  selectedMethodId?: string;
  methods: ShippingMethodItem[];
  className?: string;
}

export const puckComponentName = 'CheckoutShippingMethod';
export const puckLabel = 'Checkout Shipping Method';
export const puckCategory = 'Checkout';

export const puckFields = {
  title: { type: 'text' as const, label: 'Section Title' },
  subtitle: { type: 'text' as const, label: 'Section Subtitle' },
  selectedMethodId: { type: 'text' as const, label: 'Selected Method ID' },
  methods: {
    type: 'array' as const,
    label: 'Shipping Methods',
    arrayFields: {
      id: { type: 'text' as const, label: 'Method ID' },
      name: { type: 'text' as const, label: 'Method Name' },
      description: { type: 'text' as const, label: 'Description (optional)' },
      price: { type: 'number' as const, label: 'Price (0 = Free)' },
      estimatedDays: { type: 'text' as const, label: 'Estimated Delivery Time' },
    },
    defaultItemProps: {
      id: 'new-method',
      name: 'New Shipping Method',
      description: '',
      price: 0,
      estimatedDays: '5-7 business days',
    },
    getItemSummary: (item: ShippingMethodItem) => item.name,
    max: 10,
  },
};

export const puckDefaults = {
  title: 'Shipping Method',
  subtitle: 'Choose how you want your order delivered',
  selectedMethodId: 'standard',
  methods: [
    { id: 'standard', name: 'Standard Shipping', description: '', price: 5.99, estimatedDays: '5-7 business days' },
    { id: 'express', name: 'Express Shipping', description: '', price: 14.99, estimatedDays: '2-3 business days' },
    { id: 'overnight', name: 'Overnight Shipping', description: '', price: 29.99, estimatedDays: '1 business day' },
  ],
};

export function CheckoutShippingMethodView({
  title = 'Shipping Method',
  subtitle = 'Choose how you want your order delivered',
  selectedMethodId = '',
  methods,
  className,
}: CheckoutShippingMethodViewProps) {
  return (
    <div className={cn('@container w-full', className)}>
      <div className="mb-4 @sm:mb-6">
        <h3 className="text-lg @sm:text-xl font-bold text-text-base">{title}</h3>
        <p className="text-sm text-text-muted mt-1">{subtitle}</p>
      </div>
      <div className="space-y-3 @sm:space-y-4">
        {methods.map((method) => {
          const isSelected = selectedMethodId === method.id;
          return (
            <div
              key={method.id}
              className={cn(
                'flex items-center justify-between p-4 rounded-card border-2 transition-all',
                isSelected ? 'border-primary bg-primary/5' : 'border-border bg-bg-surface',
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  'flex h-5 w-5 items-center justify-center rounded-full border-2',
                  isSelected ? 'border-primary' : 'border-border',
                )}>
                  {isSelected && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
                </div>
                <div>
                  <p className="font-semibold text-sm text-text-base">{method.name}</p>
                  {method.description && <p className="text-xs text-text-muted mt-0.5">{method.description}</p>}
                  <p className="text-xs text-text-muted mt-0.5">{method.estimatedDays}</p>
                </div>
              </div>
              <p className="font-semibold text-sm text-text-base">
                {method.price === 0 ? 'Free' : `$${method.price.toFixed(2)}`}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
