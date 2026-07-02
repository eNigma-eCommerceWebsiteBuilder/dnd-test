'use client';

import type { SubscriptionDraft } from '@/lib/api/types/subscriptions';

type DraftValidationErrorsProps = {
  errors: string[];
  stockIssues: NonNullable<SubscriptionDraft['stockIssues']>;
};

export function DraftValidationErrors({ errors, stockIssues }: DraftValidationErrorsProps) {
  if (errors.length === 0 && stockIssues.length === 0) {
    return null;
  }

  return (
    <div className="@container rounded-card border border-border bg-danger-subtle p-4">
      <h4 className="text-sm font-semibold text-danger">Draft issues</h4>
      <div className="mt-2 space-y-2 text-sm text-text-base">
        {errors.length > 0 ? (
          <ul className="list-disc pl-5 space-y-1">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        ) : null}
        {stockIssues.length > 0 ? (
          <div>
            <p className="font-semibold text-danger">Stock issues</p>
            <ul className="list-disc pl-5 space-y-1">
              {stockIssues.map((issue) => (
                <li key={`${issue.productId}-${issue.requested}`}>
                  Product {issue.productId} has {issue.available} available (requested {issue.requested}).
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
