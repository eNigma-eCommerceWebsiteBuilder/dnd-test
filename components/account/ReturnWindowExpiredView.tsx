import { cn } from '@/lib/utils/cn';

interface ReturnWindowExpiredViewProps {
  orderNumber?: string;
  deadlineDate?: string;
  className?: string;
}

export const puckComponentName = 'ReturnWindowExpired';
export const puckLabel = 'Return Window Expired';
export const puckCategory = 'Account';

export const puckFields = {
  orderNumber: { type: 'text' as const, label: 'Order Number' },
  deadlineDate: { type: 'text' as const, label: 'Deadline Date (ISO string)' },
};

export const puckDefaults = {
  orderNumber: 'ORD-12345',
  deadlineDate: '2024-12-01',
};

export function ReturnWindowExpiredView({ orderNumber = '', deadlineDate = '', className }: ReturnWindowExpiredViewProps) {
  return (
    <div className={cn('@container bg-bg-surface rounded-card p-8 @md:p-12 text-center shadow-card border border-border', className)}>
      <div className="w-16 h-16 @md:w-20 @md:h-20 rounded-full bg-danger-subtle flex items-center justify-center mx-auto mb-6">
        <span className="material-symbols-outlined text-3xl @md:text-4xl text-danger">schedule</span>
      </div>
      <h2 className="text-xl @md:text-2xl font-bold text-text-base mb-2">Return Window Expired</h2>
      <p className="text-sm @md:text-base text-text-muted max-w-md mx-auto">
        The return window for order <strong className="text-text-base">{orderNumber}</strong> expired on <strong className="text-text-base">{deadlineDate}</strong>.
        Returns can only be requested within 30 days of delivery.
      </p>
    </div>
  );
}
