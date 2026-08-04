import type { SubscriptionDetailsPageData } from '@/enigma-components/subscriptions/canonical/subscriptionDetailsRuntime';
import { SubscriptionDetailsPageState } from '@/enigma-components/subscriptions/canonical/SubscriptionDetailsPageState';
import { loadSubscriptionDetailsRuntime } from './subscriptionDetailsRuntime';
import { puckTransparentSlotProps, type SubscriptionDetailSlot } from './types';
import { resolveSubscriptionDetailsPageData } from './viewData';

interface Props {
  content?: SubscriptionDetailSlot;
  pageData?: SubscriptionDetailsPageData | null;
  puck?: { isEditing?: boolean };
}

export const puckComponentName = 'SubscriptionDetailsPageState';
export const puckLabel = 'Subscription Details Page State';
export const puckCategory = 'Account';
export const puckFields = { content: { type: 'slot' as const, allow: ['SubscriptionDetailsPageLayout'] } };
export const puckDefaults = { content: [] };
export const puckAst = {
  kind: 'runtime', topLevel: true, slots: ['content'],
  sourceJsxNames: ['SubscriptionDetailsPageState'],
  sourceImportPaths: ['@/components/subscriptions/canonical/SubscriptionDetailsPageState'],
  role: 'subscription-details-page-state',
  conditional: '!pageData?.details?.subscription => notFound()',
  runtimeSignals: ['params.id', 'subscriptionDetails', 'subscriptionOrders', 'billingHistory'],
};

export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadSubscriptionDetailsRuntime>[0]) {
  return loadSubscriptionDetailsRuntime(context);
}

export function SubscriptionDetailsPageStateView(props: Props) {
  const pageData = resolveSubscriptionDetailsPageData(props);
  return <SubscriptionDetailsPageState pageData={pageData} content={props.content?.(puckTransparentSlotProps)} />;
}
