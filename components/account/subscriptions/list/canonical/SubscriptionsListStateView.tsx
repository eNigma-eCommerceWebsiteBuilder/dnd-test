import { SubscriptionsListState as SubscriptionsListStateRenderer } from '@/enigma-components/subscriptions/canonical/SubscriptionsPageSections';
import { loadAccountSubscriptionsRuntime } from './accountSubscriptionsRuntime';
import { puckTransparentSlotProps, type AccountSubscriptionsSlot } from './types';
import { resolveAccountSubscriptionsData } from './viewData';

interface Props {
  previewState?: 'subscriptions' | 'empty';
  subscriptions?: AccountSubscriptionsSlot;
  empty?: AccountSubscriptionsSlot;
  data?: Awaited<ReturnType<typeof loadAccountSubscriptionsRuntime>> | null;
  puck?: { isEditing?: boolean };
}

export const puckComponentName = 'SubscriptionsListState';
export const puckLabel = 'Subscriptions List State';
export const puckCategory = 'Account';
export const puckFields = {
  previewState: { type: 'select' as const, label: 'Preview State', options: [{ label: 'Subscriptions', value: 'subscriptions' }, { label: 'No subscriptions', value: 'empty' }] },
  subscriptions: { type: 'slot' as const, allow: ['SubscriptionsListClientRegion'] },
  empty: { type: 'slot' as const, allow: ['SubscriptionsEmptyRegion'] },
};
export const puckDefaults = { previewState: 'subscriptions', subscriptions: [], empty: [] };
export const puckAst = {
  kind: 'runtime', slots: ['subscriptions', 'empty'], sourceJsxNames: ['SubscriptionsListState'],
  sourceImportPaths: ['@/components/subscriptions/canonical/SubscriptionsPageSections'],
  role: 'subscriptions-list-state', slotTarget: 'content',
  conditional: 'data.subscriptions.length > 0 ? subscriptions : empty', runtimeSignals: ['subscriptions.length'],
};
export async function puckDataFetcher() { return loadAccountSubscriptionsRuntime(); }

export function SubscriptionsListState(props: Props) {
  const value = resolveAccountSubscriptionsData(props);
  if (!value) return null;
  const data = props.puck?.isEditing && props.previewState === 'empty' ? { ...value, subscriptions: [] } : value;
  return <SubscriptionsListStateRenderer hasSubscriptions={data.subscriptions.length > 0} subscriptions={props.subscriptions?.(puckTransparentSlotProps)} empty={props.empty?.(puckTransparentSlotProps)} />;
}
