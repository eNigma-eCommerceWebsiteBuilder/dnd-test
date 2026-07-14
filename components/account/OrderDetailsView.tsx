import { cn } from '@/lib/utils/cn';

interface OrderDetailsViewProps {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  className?: string;
}

export const puckComponentName = 'OrderDetails';
export const puckLabel = 'Order Details (Financial)';
export const puckCategory = 'Account';

export const puckFields = {
  subtotal: { type: 'number' as const, label: 'Subtotal' },
  tax: { type: 'number' as const, label: 'Tax' },
  shipping: { type: 'number' as const, label: 'Shipping (0 = Free)' },
  total: { type: 'number' as const, label: 'Total' },
};

export const puckDefaults = {
  subtotal: 1930,
  tax: 153.60,
  shipping: 0,
  total: 2083.60,
};

export function OrderDetailsView({ subtotal = 0, tax = 0, shipping = 0, total = 0, className }: OrderDetailsViewProps) {
  return (
    <div className={cn('@container bg-bg-surface rounded-card p-4 @md:p-6 shadow-card border border-border', className)}>
      <div className="space-y-3 @md:space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">Subtotal</span>
          <span className="font-medium text-text-base">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">Tax</span>
          <span className="font-medium text-text-base">${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">Shipping</span>
          {shipping === 0 ? (
            <span className="font-medium text-success">Free</span>
          ) : (
            <span className="font-medium text-text-base">${shipping.toFixed(2)}</span>
          )}
        </div>
        <div className="border-t border-divider pt-3 @md:pt-4 flex justify-between">
          <span className="text-base @md:text-lg font-bold text-text-base">Total</span>
          <span className="text-base @md:text-lg font-bold text-primary">${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
