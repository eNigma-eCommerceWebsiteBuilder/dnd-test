import { cn } from '@/lib/utils/cn';

const PAYMENT_LABELS: Record<string, string> = {
  stripe: 'Credit/Debit Card',
  paypal: 'PayPal',
  apple_pay: 'Apple Pay',
  google_pay: 'Google Pay',
  bank_transfer: 'Bank Transfer',
  cash_on_delivery: 'Cash on Delivery',
};

const STATUS_STYLES: Record<string, string> = {
  paid: 'bg-success-subtle text-success-dark',
  refunded: 'bg-warning-subtle text-warning-dark',
  partially_refunded: 'bg-warning-subtle text-warning-dark',
  unpaid: 'bg-danger-subtle text-danger-dark',
};

interface PaymentInfoViewProps {
  paymentMethod?: string;
  paymentStatus?: string;
  className?: string;
}

export const puckComponentName = 'PaymentInfo';
export const puckLabel = 'Payment Info';
export const puckCategory = 'Account';

export const puckFields = {
  paymentMethod: {
    type: 'select' as const,
    label: 'Payment Method',
    options: [
      { label: 'Credit/Debit Card', value: 'stripe' },
      { label: 'PayPal', value: 'paypal' },
      { label: 'Apple Pay', value: 'apple_pay' },
      { label: 'Google Pay', value: 'google_pay' },
      { label: 'Bank Transfer', value: 'bank_transfer' },
      { label: 'Cash on Delivery', value: 'cash_on_delivery' },
    ],
  },
  paymentStatus: {
    type: 'select' as const,
    label: 'Payment Status',
    options: [
      { label: 'Paid', value: 'paid' },
      { label: 'Unpaid', value: 'unpaid' },
      { label: 'Refunded', value: 'refunded' },
      { label: 'Partially Refunded', value: 'partially_refunded' },
    ],
  },
};

export const puckDefaults = {
  paymentMethod: 'stripe',
  paymentStatus: 'paid',
};

export function PaymentInfoView({ paymentMethod = '', paymentStatus = 'unpaid', className }: PaymentInfoViewProps) {
  const methodLabel = PAYMENT_LABELS[paymentMethod] || paymentMethod || 'Unknown Payment Method';
  const statusStyles = STATUS_STYLES[paymentStatus] || 'bg-bg-sunken text-text-muted';
  const statusLabel = (paymentStatus || 'pending').replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className={cn('@container bg-bg-surface rounded-card p-4 @md:p-6 shadow-card border border-border', className)}>
      <div className="flex items-center gap-2 mb-3">
        <span className="material-symbols-outlined text-primary">payments</span>
        <h3 className="text-sm @md:text-base font-bold text-text-base">Payment Information</h3>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">Method</span>
          <span className="font-medium text-text-base">{methodLabel}</span>
        </div>
        <div className="flex justify-between text-sm items-center">
          <span className="text-text-muted">Status</span>
          <span className={cn('inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold', statusStyles)}>
            {statusLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
