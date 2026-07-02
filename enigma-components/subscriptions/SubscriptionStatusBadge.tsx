import type { SubscriptionStatus } from '@/lib/api/types/subscriptions';
import { formatSubscriptionStatus } from '@/lib/utils/subscriptions';

const badgeStyles: Record<string, string> = {
  success: 'bg-success-subtle text-on-success border-success',
  warning: 'bg-warning-subtle text-on-warning border-warning',
  danger: 'bg-danger-subtle text-on-danger border-danger',
  secondary: 'bg-bg-sunken text-text-muted border-border',
};

type SubscriptionStatusBadgeProps = {
  status: SubscriptionStatus;
};

export function SubscriptionStatusBadge({ status }: SubscriptionStatusBadgeProps) {
  const display = formatSubscriptionStatus(status);
  const badgeClass = badgeStyles[display.badge] || badgeStyles.secondary;

  return (
    <div className="@container">
      <span
        className={`inline-flex items-center rounded-badge border px-2.5 py-1 text-xs font-semibold ${badgeClass}`}
      >
        {display.text}
      </span>
    </div>
  );
}
