import { getMySubscriptions } from '@/lib/api/services/subscriptions';
import type { SubscriptionsListResponse } from '@/lib/api/types/subscriptions';

export type SubscriptionsPageData = SubscriptionsListResponse;

// Preserve the route's source fetch, logging, and error propagation behavior.
export async function fetchSubscriptionsPageData(): Promise<SubscriptionsPageData> {
  try {
    return await getMySubscriptions();
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    throw error;
  }
}
