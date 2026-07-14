import { cn } from '@/lib/utils/cn';

interface CheckoutOrderReviewViewProps {
  email?: string;
  contactLabel?: string;
  shipToName?: string;
  shipToAddress1?: string;
  shipToAddress2?: string;
  shipToCity?: string;
  shipToState?: string;
  shipToPostalCode?: string;
  shipToCountry?: string;
  shippingMethodName?: string;
  paymentMethodName?: string;
  editLabel?: string;
  className?: string;
}

export const puckComponentName = 'CheckoutOrderReview';
export const puckLabel = 'Checkout Order Review';
export const puckCategory = 'Checkout';

export const puckFields = {
  email: { type: 'text' as const, label: 'Contact Email' },
  contactLabel: { type: 'text' as const, label: 'Contact Section Label' },
  shipToName: { type: 'text' as const, label: 'Ship To - Full Name' },
  shipToAddress1: { type: 'text' as const, label: 'Ship To - Address Line 1' },
  shipToAddress2: { type: 'text' as const, label: 'Ship To - Address Line 2' },
  shipToCity: { type: 'text' as const, label: 'Ship To - City' },
  shipToState: { type: 'text' as const, label: 'Ship To - State' },
  shipToPostalCode: { type: 'text' as const, label: 'Ship To - Postal Code' },
  shipToCountry: { type: 'text' as const, label: 'Ship To - Country' },
  shippingMethodName: { type: 'text' as const, label: 'Shipping Method Name' },
  paymentMethodName: { type: 'text' as const, label: 'Payment Method Name' },
  editLabel: { type: 'text' as const, label: 'Edit Button Label' },
};

export const puckDefaults = {
  email: 'customer@example.com',
  contactLabel: 'Contact',
  shipToName: 'John Doe',
  shipToAddress1: '123 Main Street',
  shipToAddress2: 'Apt 4B',
  shipToCity: 'New York',
  shipToState: 'NY',
  shipToPostalCode: '10001',
  shipToCountry: 'United States',
  shippingMethodName: 'Standard Shipping (5-7 business days)',
  paymentMethodName: 'Credit Card',
  editLabel: 'Change',
};

export function CheckoutOrderReviewView({
  email = '',
  contactLabel = 'Contact',
  shipToName = '',
  shipToAddress1 = '',
  shipToAddress2 = '',
  shipToCity = '',
  shipToState = '',
  shipToPostalCode = '',
  shipToCountry = '',
  shippingMethodName = '',
  paymentMethodName = '',
  editLabel = 'Change',
  className,
}: CheckoutOrderReviewViewProps) {
  return (
    <div className={cn('@container w-full space-y-4', className)}>
      <div className="bg-bg-surface border border-border rounded-card divide-y divide-divider">
        <div className="p-4 flex justify-between items-start gap-4">
          <div className="space-y-1">
            <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">{contactLabel}</p>
            <p className="text-sm text-text-base font-medium">{email}</p>
          </div>
          <span className="text-sm text-primary font-medium">{editLabel}</span>
        </div>
        <div className="p-4 flex justify-between items-start gap-4">
          <div className="space-y-1">
            <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">Ship To</p>
            <p className="text-sm text-text-base">
              {shipToName}<br />
              {shipToAddress1}
              {shipToAddress2 && <>, {shipToAddress2}</>}
              <br />
              {shipToCity}, {shipToState} {shipToPostalCode}
              <br />
              {shipToCountry}
            </p>
          </div>
          <span className="text-sm text-primary font-medium">{editLabel}</span>
        </div>
        <div className="p-4 flex justify-between items-start gap-4">
          <div className="space-y-1">
            <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">Method</p>
            <p className="text-sm text-text-base font-medium">{shippingMethodName}</p>
          </div>
          <span className="text-sm text-primary font-medium">{editLabel}</span>
        </div>
        <div className="p-4 flex justify-between items-start gap-4">
          <div className="space-y-1">
            <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">Payment</p>
            <p className="text-sm text-text-base font-medium">{paymentMethodName}</p>
          </div>
          <span className="text-sm text-primary font-medium">{editLabel}</span>
        </div>
      </div>
    </div>
  );
}
