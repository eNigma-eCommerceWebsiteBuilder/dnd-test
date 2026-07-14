'use client';

import type { BillingAttempt } from '@/lib/api/types/subscriptions';

const isFailed = (attempt: BillingAttempt) => attempt.status === 'failed';

type FailedPaymentAlertProps = {
  attempts: BillingAttempt[];
};

export function FailedPaymentAlert({ attempts }: FailedPaymentAlertProps) {
  const hasFailure = attempts.some(isFailed);

  if (!hasFailure) return null;

  return (
    <div className="@container w-full rounded-card border border-border bg-danger-subtle p-4">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-danger">error</span>
        <div>
          <p className="text-sm font-semibold text-danger">Payment failed</p>
          <p className="text-xs text-text-base">
            Update your payment method to avoid service interruption.
          </p>
        </div>
      </div>
    </div>
  );
}
