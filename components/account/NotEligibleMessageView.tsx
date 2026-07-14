import { cn } from '@/lib/utils/cn';

interface NotEligibleMessageViewProps {
  orderNumber?: string;
  message?: string;
  className?: string;
}

export const puckComponentName = 'NotEligibleMessage';
export const puckLabel = 'Not Eligible for Return';
export const puckCategory = 'Account';

export const puckFields = {
  orderNumber: { type: 'text' as const, label: 'Order Number' },
  message: { type: 'textarea' as const, label: 'Message' },
};

export const puckDefaults = {
  orderNumber: 'ORD-12345',
  message: 'This order is not eligible for a return. Some items may be non-returnable due to their category or condition.',
};

export function NotEligibleMessageView({ orderNumber = '', message = '', className }: NotEligibleMessageViewProps) {
  return (
    <div className={cn('@container bg-bg-surface rounded-card p-8 @md:p-12 text-center shadow-card border border-border', className)}>
      <div className="w-16 h-16 @md:w-20 @md:h-20 rounded-full bg-warning-subtle flex items-center justify-center mx-auto mb-6">
        <span className="material-symbols-outlined text-3xl @md:text-4xl text-warning">error</span>
      </div>
      <h2 className="text-xl @md:text-2xl font-bold text-text-base mb-2">Not Eligible for Return</h2>
      <p className="text-sm @md:text-base text-text-muted max-w-md mx-auto">
        {message}
      </p>
      {orderNumber && <p className="mt-4 text-sm text-text-muted">Order: <strong className="text-text-base">{orderNumber}</strong></p>}
    </div>
  );
}
