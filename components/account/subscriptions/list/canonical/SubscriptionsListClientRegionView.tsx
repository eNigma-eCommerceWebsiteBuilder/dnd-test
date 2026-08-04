import { SubscriptionsListClientRegion as SubscriptionsListClientRegionRenderer } from '@/enigma-components/subscriptions/canonical/SubscriptionsPageSections';
import { loadAccountSubscriptionsRuntime } from './accountSubscriptionsRuntime';
import { puckTransparentSlotProps, type AccountSubscriptionsSlot } from './types';
import { resolveAccountSubscriptionsData } from './viewData';

interface Props { content?: AccountSubscriptionsSlot; data?: Awaited<ReturnType<typeof loadAccountSubscriptionsRuntime>> | null; puck?: { isEditing?: boolean }; }

export const puckComponentName = 'SubscriptionsListClientRegion';
export const puckLabel = 'Subscriptions List Filter Region';
export const puckCategory = 'Account';
export const puckFields = { content: { type: 'slot' as const, allow: ['SubscriptionsCardsList'] } };
export const puckDefaults = { content: [] };
export const puckAst = {
  kind: 'runtime', slots: ['content'], sourceJsxNames: ['SubscriptionsListClientRegion', 'SubscriptionListClient'],
  sourceImportPaths: ['@/components/subscriptions/canonical/SubscriptionsPageSections', '@/components/subscriptions/SubscriptionListClient'],
  role: 'subscriptions-list-client-region', slotTarget: 'subscriptions', runtimeSignals: ['context.filter', 'subscription.status'],
  conditional: 'context.filter && context.filter !== status',
};
export async function puckDataFetcher() { return loadAccountSubscriptionsRuntime(); }

export function SubscriptionsListClientRegion(props: Props) {
  const data = resolveAccountSubscriptionsData(props);
  return data ? <SubscriptionsListClientRegionRenderer subscriptions={data.subscriptions} content={props.content?.(puckTransparentSlotProps)} /> : null;
}
