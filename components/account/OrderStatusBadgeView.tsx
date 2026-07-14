import { cn } from '@/lib/utils/cn';

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-warning-subtle text-warning-dark',
  processing: 'bg-info-subtle text-info-dark',
  shipped: 'bg-primary-100 text-primary-dark',
  delivered: 'bg-success-subtle text-success-dark',
  cancelled: 'bg-danger-subtle text-danger-dark',
  'refund-requested': 'bg-warning-subtle text-warning-dark',
  'exchange-requested': 'bg-info-subtle text-info-dark',
};

const STATUS_ICONS: Record<string, string> = {
  pending: 'schedule',
  processing: 'sync',
  shipped: 'local_shipping',
  delivered: 'check_circle',
  cancelled: 'cancel',
  'refund-requested': 'undo',
  'exchange-requested': 'swap_horiz',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  'refund-requested': 'Refund Requested',
  'exchange-requested': 'Exchange Requested',
};

interface OrderStatusBadgeViewProps {
  status: string;
  className?: string;
}

export const puckComponentName = 'OrderStatusBadge';
export const puckLabel = 'Order Status Badge';
export const puckCategory = 'Account';

export const puckFields = {
  status: {
    type: 'select' as const,
    label: 'Status',
    options: [
      { label: 'Pending', value: 'pending' },
      { label: 'Processing', value: 'processing' },
      { label: 'Shipped', value: 'shipped' },
      { label: 'Delivered', value: 'delivered' },
      { label: 'Cancelled', value: 'cancelled' },
      { label: 'Refund Requested', value: 'refund-requested' },
      { label: 'Exchange Requested', value: 'exchange-requested' },
    ],
  },
};

export const puckDefaults = {
  status: 'processing',
};

export function OrderStatusBadgeView({ status = 'pending', className }: OrderStatusBadgeViewProps) {
  const styles = STATUS_STYLES[status] || 'bg-bg-sunken text-text-muted';
  const icon = STATUS_ICONS[status] || 'help';
  const label = STATUS_LABELS[status] || status;

  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold', styles, className)}>
      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>{icon}</span>
      {label}
    </span>
  );
}
