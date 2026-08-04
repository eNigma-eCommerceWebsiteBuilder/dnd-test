import type { SubscriptionsPageData } from '@/enigma-components/subscriptions/canonical/subscriptionsPageRuntime';
import { subscriptionDetailsPreview } from '../../canonical/preview';

// Reuse the production-shaped contract fixture used by the subscription detail editor.
export const accountSubscriptionsPreview: SubscriptionsPageData = {
  subscriptions: [subscriptionDetailsPreview.details.subscription],
  pagination: { page: 1, limit: 10, total: 1, pages: 1 },
};
