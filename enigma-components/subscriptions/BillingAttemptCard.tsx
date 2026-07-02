import type { BillingAttempt } from '@/lib/api/types/subscriptions';
import { formatDate, formatPrice } from '@/lib/utils/formatters';

const statusStyles: Record<string, string> = {
  succeeded: 'text-success',
  failed: 'text-danger',
  pending: 'text-warning',
};

type BillingAttemptCardProps = {
  attempt: BillingAttempt;
};

export function BillingAttemptCard({ attempt }: BillingAttemptCardProps) {
  const statusText = attempt.status.charAt(0).toUpperCase() + attempt.status.slice(1);
  const statusClass = statusStyles[attempt.status] || 'text-text-muted';

  return (
    <div className="@container flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-text-base">{formatDate(attempt.processedAt)}</p>
        <p className={`text-xs font-medium ${statusClass}`}>{statusText}</p>
      </div>
      <p className="text-sm font-semibold text-text-base">
        {formatPrice(attempt.totalAmount || attempt.amount)}
      </p>
    </div>
  );
}
