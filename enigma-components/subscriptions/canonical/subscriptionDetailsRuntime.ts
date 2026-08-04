import {
  getBillingHistory,
  getSubscriptionDetails,
  getSubscriptionOrders,
} from '@/lib/api/services/subscriptions';
import { canModifySubscription } from '@/lib/utils/subscriptions';

export interface SubscriptionActionVisibility {
  showCancel: boolean;
  showPause: boolean;
  showResume: boolean;
  showSkip: boolean;
}

export interface SubscriptionDetailsPageData {
  billingHistory: Awaited<ReturnType<typeof getBillingHistory>>;
  details: Awaited<ReturnType<typeof getSubscriptionDetails>>;
  orders: Awaited<ReturnType<typeof getSubscriptionOrders>>;
}

// This is the route's shared data contract. Puck adapters mirror it with the
// dynamic route id instead of persisting any response into a seed.
export async function fetchSubscriptionDetailsPageData(
  id: string,
): Promise<SubscriptionDetailsPageData> {
  const [details, orders, billingHistory] = await Promise.all([
    getSubscriptionDetails(id),
    getSubscriptionOrders(id, 1, 10),
    getBillingHistory(id, 1, 10),
  ]);

  return { billingHistory, details, orders };
}

export function getSubscriptionActionVisibility(
  subscription: SubscriptionDetailsPageData['details']['subscription'],
): SubscriptionActionVisibility {
  const canModify = canModifySubscription(subscription);
  const isActive = subscription.status === 'active';
  const isPaused = subscription.status === 'paused';

  return {
    showCancel: isActive || isPaused,
    showPause: canModify && isActive,
    showResume: canModify && isPaused,
    showSkip: canModify && isActive,
  };
}
