import { cn } from '@/lib/utils/cn';

interface RefundSummaryViewProps {
  refundAmount?: number;
  refundMethod?: string;
  refundStatus?: string;
  className?: string;
}

export const puckComponentName = 'RefundSummary';
export const puckLabel = 'Refund Summary';
export const puckCategory = 'Account';

export const puckFields = {
  refundAmount: { type: 'number' as const, label: 'Refund Amount' },
  refundMethod: { type: 'text' as const, label: 'Refund Method' },
  refundStatus: {
    type: 'select' as const,
    label: 'Refund Status',
    options: [
      { label: 'Pending', value: 'pending' },
      { label: 'Processed', value: 'processed' },
      { label: 'Failed', value: 'failed' },
    ],
  },
};

export const puckDefaults = {
  refundAmount: 1290,
  refundMethod: 'Original payment method (Credit Card)',
  refundStatus: 'pending',
};

export function RefundSummaryView({ refundAmount = 0, refundMethod = '', refundStatus = 'pending', className }: RefundSummaryViewProps) {
  const statusStyles: Record<string, string> = {
    pending: 'bg-warning-subtle text-warning-dark',
    processed: 'bg-success-subtle text-success-dark',
    failed: 'bg-danger-subtle text-danger-dark',
  };
  const styles = statusStyles[refundStatus] || 'bg-bg-sunken text-text-muted';
  const statusLabel = (refundStatus || '').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className={cn('@container bg-bg-surface rounded-card p-4 @md:p-6 shadow-card border border-border', className)}>
      <div className="flex items-center gap-2 mb-3">
        <span className="material-symbols-outlined text-primary">payments</span>
        <h3 className="text-sm @md:text-base font-bold text-text-base">Refund Summary</h3>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">Refund amount</span>
          <span className="font-bold text-lg text-primary">${refundAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">Method</span>
          <span className="font-medium text-text-base">{refundMethod}</span>
        </div>
        <div className="flex justify-between text-sm items-center">
          <span className="text-text-muted">Status</span>
          <span className={cn('inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold', styles)}>{statusLabel}</span>
        </div>
      </div>
    </div>
  );
}
