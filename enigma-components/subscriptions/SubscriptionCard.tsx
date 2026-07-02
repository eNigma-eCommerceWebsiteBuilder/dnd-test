import type { SubscriptionContract } from '@/lib/api/types/subscriptions';
import { BillingInterval } from '@/components/subscriptions/BillingInterval';
import { NextBillingCard } from '@/components/subscriptions/NextBillingCard';
import { SubscriptionItems } from '@/components/subscriptions/SubscriptionItems';
import { SubscriptionStatusBadge } from '@/components/subscriptions/SubscriptionStatusBadge';
import { ViewDetailsButton } from '@/components/subscriptions/ViewDetailsButton';
import { QuickPauseButton } from '@/components/subscriptions/QuickPauseButton';
import { QuickResumeButton } from '@/components/subscriptions/QuickResumeButton';
import { formatDate } from '@/lib/utils/formatters';
import { canModifySubscription } from '@/lib/utils/subscriptions';

const dateOptions: Intl.DateTimeFormatOptions = { dateStyle: 'medium' };

type SubscriptionCardProps = {
  subscription: SubscriptionContract;
};

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  const canModify = canModifySubscription(subscription);
  const showPause = canModify && subscription.status === 'active';
  const showResume = canModify && subscription.status === 'paused';

  return (
    <article className="@container w-full rounded-card border border-border bg-bg-surface p-6 shadow-card">
      <div className="flex flex-col gap-6 @md:flex-row @md:items-start @md:justify-between">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm font-semibold text-text-muted">
              Subscription {subscription.contractNumber}
            </p>
            <SubscriptionStatusBadge status={subscription.status} />
          </div>
          <p className="text-sm text-text-muted">
            Started {formatDate(subscription.createdAt, dateOptions)}
          </p>
          <BillingInterval billingPolicy={subscription.billingPolicy} />
        </div>
        <div className="@md:w-60">
          <NextBillingCard subscription={subscription} />
        </div>
      </div>
      <div className="mt-6 border-t border-border pt-6">
        <SubscriptionItems subscription={subscription} />
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <ViewDetailsButton subscriptionId={subscription._id} />
        <div className="flex flex-wrap items-center gap-2">
          {showPause ? <QuickPauseButton subscriptionId={subscription._id} /> : null}
          {showResume ? <QuickResumeButton subscriptionId={subscription._id} /> : null}
        </div>
      </div>
    </article>
  );
}
