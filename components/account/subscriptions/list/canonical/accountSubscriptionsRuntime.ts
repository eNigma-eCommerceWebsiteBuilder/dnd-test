import { cache } from 'react';
import {
  fetchSubscriptionsPageData,
  type SubscriptionsPageData,
} from '@/enigma-components/subscriptions/canonical/subscriptionsPageRuntime';

const load = cache(async (): Promise<SubscriptionsPageData> => fetchSubscriptionsPageData());

export function loadAccountSubscriptionsRuntime(): Promise<SubscriptionsPageData> {
  return load();
}
