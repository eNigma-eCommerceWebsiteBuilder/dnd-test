import type { SubscriptionsPageData } from '@/enigma-components/subscriptions/canonical/subscriptionsPageRuntime';
import { accountSubscriptionsPreview } from './preview';

export interface AccountSubscriptionsRuntimeProps {
  data?: SubscriptionsPageData | null;
  puck?: { isEditing?: boolean };
}

export function resolveAccountSubscriptionsData({
  data = null,
  puck,
}: AccountSubscriptionsRuntimeProps): SubscriptionsPageData | null {
  return puck?.isEditing ? accountSubscriptionsPreview : data;
}
