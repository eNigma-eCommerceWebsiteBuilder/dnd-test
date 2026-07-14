import { cn } from '@/lib/utils/cn';

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-success-subtle text-success-dark',
  paused: 'bg-warning-subtle text-warning-dark',
  cancelled: 'bg-danger-subtle text-danger-dark',
  expired: 'bg-bg-sunken text-text-muted',
  pending: 'bg-info-subtle text-info-dark',
};

const STATUS_ICONS: Record<string, string> = {
  active: 'check_circle',
  paused: 'pause_circle',
  cancelled: 'cancel',
  expired: 'schedule',
  pending: 'hourglass_top',
};

interface SubscriptionStatusBadgeViewProps {
  status: string;
  className?: string;
}

export const puckComponentName = 'SubscriptionStatusBadge';
export const puckLabel = 'Subscription Status Badge';
export const puckCategory = 'Account';

export const puckFields = {
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
};

export const puckDefaults = {
  status: 'active',
};

export function SubscriptionStatusBadgeView({ status = 'active', className }: SubscriptionStatusBadgeViewProps) {
  const styles = STATUS_STYLES[status] || 'bg-bg-sunken text-text-muted';
  const icon = STATUS_ICONS[status] || 'help';
  const label = (status || '').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold', styles, className)}>
      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>{icon}</span>
      {label}
    </span>
  );
}
