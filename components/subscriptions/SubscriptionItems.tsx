import type { SubscriptionContract } from '@/lib/api/types/subscriptions';
import { SubscriptionLineItem } from '@/components/subscriptions/SubscriptionLineItem';

type SubscriptionItemsProps = {
  subscription: SubscriptionContract;
};

export function SubscriptionItems({ subscription }: SubscriptionItemsProps) {
  return (
    <div className="@container w-full space-y-3">
      <h3 className="text-sm font-semibold text-text-base">Items</h3>
      <div className="space-y-3">
        {subscription.lines.map((line) => (
          <SubscriptionLineItem key={line._id} line={line} />
        ))}
      </div>
    </div>
  );
}
