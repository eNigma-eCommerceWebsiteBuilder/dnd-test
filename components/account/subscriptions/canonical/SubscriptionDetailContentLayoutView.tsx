import { SubscriptionDetailContentLayout } from '@/enigma-components/subscriptions/canonical/SubscriptionDetailsPageSections';
import { puckTransparentSlotProps, type SubscriptionDetailSlot } from './types';

interface Props { primary?: SubscriptionDetailSlot; sidebar?: SubscriptionDetailSlot; }

export const puckComponentName = 'SubscriptionDetailContentLayout';
export const puckLabel = 'Subscription Details Content Layout';
export const puckCategory = 'Account';
export const puckFields = {
  primary: { type: 'slot' as const, allow: ['SubscriptionItemsPanel', 'SubscriptionModifyPanel', 'SubscriptionOrdersPanel'] },
  sidebar: { type: 'slot' as const, allow: ['SubscriptionNextDeliveryRegion', 'SubscriptionUpcomingAmountRegion', 'SubscriptionLifecycleActionsPanel', 'SubscriptionBillingHistoryPanel', 'SubscriptionPaymentPanel'] },
};
export const puckDefaults = { primary: [], sidebar: [] };
export const puckAst = {
  kind: 'static', slots: ['primary', 'sidebar'],
  sourceJsxNames: ['SubscriptionDetailContentLayout'],
  sourceImportPaths: ['@/components/subscriptions/canonical/SubscriptionDetailsPageSections'],
  role: 'subscription-details-content-layout', slotTarget: 'content',
  parentSignature: 'SubscriptionDetailsPageLayout > SubscriptionDetailContentLayout',
};

export function SubscriptionDetailContentLayoutView({ primary, sidebar }: Props) {
  return <SubscriptionDetailContentLayout primary={primary?.(puckTransparentSlotProps)} sidebar={sidebar?.(puckTransparentSlotProps)} />;
}
