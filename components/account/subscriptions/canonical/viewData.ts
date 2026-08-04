import type { SubscriptionDetailsPageData } from '@/enigma-components/subscriptions/canonical/subscriptionDetailsRuntime';
import { subscriptionDetailsPreview } from './preview';

export interface SubscriptionDetailsRuntimeProps {
  pageData?: SubscriptionDetailsPageData | null;
  puck?: { isEditing?: boolean };
}

export function resolveSubscriptionDetailsPageData({
  pageData = null,
  puck,
}: SubscriptionDetailsRuntimeProps): SubscriptionDetailsPageData | null {
  return puck?.isEditing ? subscriptionDetailsPreview : pageData;
}
