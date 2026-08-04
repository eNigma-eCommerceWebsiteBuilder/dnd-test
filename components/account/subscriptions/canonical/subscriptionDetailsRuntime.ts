import { cache } from 'react';
import {
  fetchSubscriptionDetailsPageData,
  type SubscriptionDetailsPageData,
} from '@/enigma-components/subscriptions/canonical/subscriptionDetailsRuntime';
import {
  getRouteParam,
  type PuckFetcherContext,
} from '@/lib/puck-route-metadata';

export interface SubscriptionDetailsRuntime {
  pageData: SubscriptionDetailsPageData | null;
  subscriptionId: string;
}

export function resolveSubscriptionDetailsId(context?: PuckFetcherContext): string {
  return getRouteParam(context, 'id') || '';
}

const loadById = cache(async (subscriptionId: string): Promise<SubscriptionDetailsRuntime> => {
  if (!subscriptionId) return { subscriptionId, pageData: null };

  return {
    subscriptionId,
    pageData: await fetchSubscriptionDetailsPageData(subscriptionId),
  };
});

// Every data-aware View uses this cached source-equivalent loader, ensuring all
// nested regions receive one coherent subscription response for a request.
export function loadSubscriptionDetailsRuntime(
  context?: PuckFetcherContext,
): Promise<SubscriptionDetailsRuntime> {
  return loadById(resolveSubscriptionDetailsId(context));
}
