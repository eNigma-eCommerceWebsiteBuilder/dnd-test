import { cn } from '@/lib/utils/cn';
import { formatPrice } from '@/lib/utils/formatters';

interface OrderSummaryViewProps {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  className?: string;
}

export const puckComponentName = 'ConfirmationOrderSummary';
export const puckLabel = 'Order Summary';
export const puckCategory = 'Checkout';

export const puckFields = {
  subtotal: { type: 'number' as const, label: 'Subtotal' },
  tax: { type: 'number' as const, label: 'Tax' },
  shipping: { type: 'number' as const, label: 'Shipping (0 = Free)' },
  total: { type: 'number' as const, label: 'Total' },
};

export const puckDefaults = {
  subtotal: 810,
  tax: 64.8,
  shipping: 0,
  total: 874.8,
};


export function OrderSummaryView({ subtotal, tax, shipping, total, className }: OrderSummaryViewProps) {
  return (
    <div className={cn('@container', className)}>
      <div className="rounded-card border border-border bg-bg-surface p-4 shadow-card @md:p-6">
        <div className="space-y-3 @md:space-y-4">
          <div className="flex justify-between text-sm text-text-muted">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-text-muted">
            <span>Tax</span>
            <span>{formatPrice(tax)}</span>
          </div>
          <div className="flex justify-between text-sm text-text-muted">
            <span>Shipping</span>
            <span className={shipping === 0 ? 'font-medium text-primary' : ''}>
              {shipping === 0 ? 'Free' : formatPrice(shipping)}
            </span>
          </div>
          <div className="flex items-end justify-between border-t border-divider pt-3 @md:pt-4">
            <span className="text-base font-bold text-text-base @md:text-lg">Total</span>
            <span className="text-xl font-bold text-primary @md:text-2xl">
              {formatPrice(total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
