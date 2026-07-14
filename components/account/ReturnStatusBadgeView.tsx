import { cn } from '@/lib/utils/cn';

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-warning-subtle text-warning-dark',
  approved: 'bg-success-subtle text-success-dark',
  rejected: 'bg-danger-subtle text-danger-dark',
  completed: 'bg-success-subtle text-success-dark',
  cancelled: 'bg-bg-sunken text-text-muted',
};

const STATUS_ICONS: Record<string, string> = {
  pending: 'schedule',
  approved: 'check_circle',
  rejected: 'cancel',
  completed: 'task_alt',
  cancelled: 'block',
};

interface ReturnStatusBadgeViewProps {
  status: string;
  className?: string;
}

export const puckComponentName = 'ReturnStatusBadge';
export const puckLabel = 'Return Status Badge';
export const puckCategory = 'Account';

export const puckFields = {
  status: {
    type: 'select' as const,
    label: 'Status',
    options: [
      { label: 'Pending', value: 'pending' },
      { label: 'Approved', value: 'approved' },
      { label: 'Rejected', value: 'rejected' },
      { label: 'Completed', value: 'completed' },
      { label: 'Cancelled', value: 'cancelled' },
    ],
  },
};

export const puckDefaults = {
  status: 'pending',
};

export function ReturnStatusBadgeView({ status = 'pending', className }: ReturnStatusBadgeViewProps) {
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
