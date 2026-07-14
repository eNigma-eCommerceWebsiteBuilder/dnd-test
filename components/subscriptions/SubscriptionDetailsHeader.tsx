import type { SubscriptionContract } from '@/lib/api/types/subscriptions';
import { cn } from '@/lib/utils/cn';
import { formatDate } from '@/lib/utils/formatters';
import { SubscriptionStatusBadge } from '@/components/subscriptions/SubscriptionStatusBadge';

type SubscriptionDetailsHeaderProps = {
  subscription: SubscriptionContract;
  className?: string;
};

export function SubscriptionDetailsHeader({ subscription, className }: SubscriptionDetailsHeaderProps) {
  const createdDate = formatDate(subscription.createdAt);

  return (
    <header className={cn("@container flex w-full flex-col gap-3", className)}>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-heading font-bold text-text-base @md:text-3xl">
          Subscription {subscription.contractNumber}
        </h1>
        <SubscriptionStatusBadge status={subscription.status} />
      </div>
      <p className="text-sm text-text-muted">Created on {createdDate}</p>
    </header>
  );
}
