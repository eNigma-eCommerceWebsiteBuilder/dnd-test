'use client';

import type { BillingAttempt } from '@/lib/api/types/subscriptions';
import { useSubscriptionBilling } from '@/lib/hooks';
import { formatDate, formatPrice } from '@/lib/utils/formatters';

const statusStyles: Record<string, string> = {
  succeeded: 'text-success',
  failed: 'text-danger',
  pending: 'text-warning',
};

type BillingHistoryListProps = {
  subscriptionId: string;
  initialAttempts: BillingAttempt[];
  showHeader?: boolean;
};

export function BillingHistoryList({
  subscriptionId,
  initialAttempts,
  showHeader = true,
}: BillingHistoryListProps) {
  const { billingHistory, loading, error, loadBillingHistory } = useSubscriptionBilling();
  const items = billingHistory.length > 0 ? billingHistory : initialAttempts;

  const handleRefresh = () => {
    void loadBillingHistory(subscriptionId);
  };

  return (
    <div className="@container w-full space-y-4">
      {showHeader ? (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-base">Billing history</h3>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            className="text-sm font-semibold text-primary hover:underline disabled:opacity-disabled"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      ) : (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            className="text-sm font-semibold text-primary hover:underline disabled:opacity-disabled"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      )}

      {error ? (
        <p className="text-sm text-danger" role="status" aria-live="polite">
          {error}
        </p>
      ) : null}

      <div className="divide-y divide-border">
        {items.length > 0 ? (
          items.map((attempt) => {
            const statusText = attempt.status.charAt(0).toUpperCase() + attempt.status.slice(1);
            const statusClass = statusStyles[attempt.status] || 'text-text-muted';

            return (
              <div
                key={attempt._id}
                className="@container flex items-center justify-between gap-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-text-base">
                    {formatDate(attempt.processedAt)}
                  </p>
                  <p className={`text-xs font-medium ${statusClass}`}>{statusText}</p>
                </div>
                <p className="text-sm font-semibold text-text-base">
                  {formatPrice(attempt.totalAmount || attempt.amount)}
                </p>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-text-muted">No billing attempts yet.</p>
        )}
      </div>
    </div>
  );
}
