import { cn } from '@/lib/utils/cn';

interface ReturnReasonViewProps {
  reason?: string;
  details?: string;
  category?: string;
  className?: string;
}

export const puckComponentName = 'ReturnReason';
export const puckLabel = 'Return Reason';
export const puckCategory = 'Account';

export const puckFields = {
  reason: { type: 'text' as const, label: 'Reason' },
  details: { type: 'textarea' as const, label: 'Details' },
  category: { type: 'text' as const, label: 'Category' },
};

export const puckDefaults = {
  reason: 'Item arrived damaged',
  details: 'The product packaging was severely damaged during transit, rendering the product unusable.',
  category: 'Quality Issue',
};

export function ReturnReasonView({ reason = '', details = '', category = '', className }: ReturnReasonViewProps) {
  return (
    <div className={cn('@container bg-bg-surface rounded-card p-4 @md:p-6 shadow-card border border-border', className)}>
      <div className="flex items-center gap-2 mb-3">
        <span className="material-symbols-outlined text-primary">help</span>
        <h3 className="text-sm @md:text-base font-bold text-text-base">Return Reason</h3>
      </div>
      <div className="space-y-3">
        {category && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">Category</p>
            <p className="text-sm text-text-base">{category}</p>
          </div>
        )}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">Reason</p>
          <p className="text-sm text-text-base">{reason}</p>
        </div>
        {details && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">Details</p>
            <p className="text-sm text-text-muted leading-relaxed">{details}</p>
          </div>
        )}
      </div>
    </div>
  );
}
