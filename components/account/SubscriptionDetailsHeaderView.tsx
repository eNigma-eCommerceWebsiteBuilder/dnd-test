import { cn } from '@/lib/utils/cn';

interface SubscriptionDetailsHeaderViewProps {
  subscriptionId?: string;
  planName?: string;
  status?: string;
  frequency?: string;
  nextBillingDate?: string;
  amount?: number;
  className?: string;
}

export const puckComponentName = 'SubscriptionDetailsHeader';
export const puckLabel = 'Subscription Details Header';
export const puckCategory = 'Account';

export const puckFields = {
  subscriptionId: { type: 'text' as const, label: 'Subscription ID' },
  planName: { type: 'text' as const, label: 'Plan Name' },
  status: {
    type: 'select' as const,
    label: 'Status',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Paused', value: 'paused' },
      { label: 'Cancelled', value: 'cancelled' },
      { label: 'Expired', value: 'expired' },
      { label: 'Pending', value: 'pending' },
    ],
  },
  frequency: { type: 'text' as const, label: 'Billing Frequency' },
  nextBillingDate: { type: 'text' as const, label: 'Next Billing Date' },
  amount: { type: 'number' as const, label: 'Amount' },
};

export const puckDefaults = {
  subscriptionId: 'SUB-001',
  planName: 'Premium Monthly',
  status: 'active',
  frequency: 'Monthly',
  nextBillingDate: '2025-02-01',
  amount: 49.99,
};

export function SubscriptionDetailsHeaderView({
  subscriptionId = '',
  planName = '',
  status = 'active',
  frequency = '',
  nextBillingDate = '',
  amount = 0,
  className,
}: SubscriptionDetailsHeaderViewProps) {
  return (
    <div className={cn('@container bg-bg-surface rounded-card p-6 shadow-card border border-border', className)}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Subscription</p>
          <h2 className="text-2xl font-bold text-text-base">{planName}</h2>
          <p className="text-sm text-text-muted">ID: {subscriptionId}</p>
        </div>
        <span className={cn(
          'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold',
          status === 'active' && 'bg-success-subtle text-success-dark',
          status === 'paused' && 'bg-warning-subtle text-warning-dark',
          status === 'cancelled' && 'bg-danger-subtle text-danger-dark',
          status === 'expired' && 'bg-bg-sunken text-text-muted',
          status === 'pending' && 'bg-info-subtle text-info-dark',
        )}>
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
            {status === 'active' ? 'check_circle' : status === 'paused' ? 'pause_circle' : status === 'cancelled' ? 'cancel' : 'schedule'}
          </span>
          {(status || '').replace(/\b\w/g, (c) => c.toUpperCase())}
        </span>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 @sm:grid-cols-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Frequency</p>
          <p className="mt-1 text-sm font-medium text-text-base">{frequency}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Next Billing</p>
          <p className="mt-1 text-sm font-medium text-text-base">{nextBillingDate}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Amount</p>
          <p className="mt-1 text-sm font-bold text-primary">${amount.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
