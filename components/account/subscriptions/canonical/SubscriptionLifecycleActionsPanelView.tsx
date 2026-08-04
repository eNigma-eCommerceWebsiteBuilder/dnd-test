import type { SubscriptionDetailsPageData } from '@/enigma-components/subscriptions/canonical/subscriptionDetailsRuntime';
import { SubscriptionLifecycleActionsPanel } from '@/enigma-components/subscriptions/canonical/SubscriptionDetailsPageSections';
import { loadSubscriptionDetailsRuntime } from './subscriptionDetailsRuntime';
import { puckTransparentSlotProps, type SubscriptionDetailSlot } from './types';
import { resolveSubscriptionDetailsPageData } from './viewData';

interface Props {
  pause?: SubscriptionDetailSlot;
  resume?: SubscriptionDetailSlot;
  skip?: SubscriptionDetailSlot;
  cancel?: SubscriptionDetailSlot;
  pageData?: SubscriptionDetailsPageData | null;
  puck?: { isEditing?: boolean };
}

export const puckComponentName = 'SubscriptionLifecycleActionsPanel';
export const puckLabel = 'Subscription Lifecycle Actions';
export const puckCategory = 'Account';
export const puckFields = {
  pause: { type: 'slot' as const, allow: ['SubscriptionPauseAction'] },
  resume: { type: 'slot' as const, allow: ['SubscriptionResumeAction'] },
  skip: { type: 'slot' as const, allow: ['SubscriptionSkipDeliveryAction'] },
  cancel: { type: 'slot' as const, allow: ['SubscriptionCancelAction'] },
};
export const puckDefaults = { pause: [], resume: [], skip: [], cancel: [] };
export const puckAst = {
  kind: 'runtime', slots: ['pause', 'resume', 'skip', 'cancel'],
  sourceJsxNames: ['SubscriptionLifecycleActionsPanel', 'PauseButton', 'ResumeButton', 'SkipDeliveryButton', 'CancelButton'],
  sourceImportPaths: ['@/components/subscriptions/canonical/SubscriptionDetailsPageSections'],
  role: 'subscription-details-lifecycle-actions', slotTarget: 'sidebar',
  conditional: 'showPause/showResume/showSkip/showCancel from getSubscriptionActionVisibility(subscription)',
  runtimeSignals: ['params.id', 'subscription.status', 'subscription.billingPolicy'],
};
export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadSubscriptionDetailsRuntime>[0]) { return loadSubscriptionDetailsRuntime(context); }
export function SubscriptionLifecycleActionsPanelView(props: Props) {
  const subscription = resolveSubscriptionDetailsPageData(props)?.details.subscription;
  return subscription ? <SubscriptionLifecycleActionsPanel subscription={subscription} pause={props.pause?.(puckTransparentSlotProps)} resume={props.resume?.(puckTransparentSlotProps)} skip={props.skip?.(puckTransparentSlotProps)} cancel={props.cancel?.(puckTransparentSlotProps)} /> : null;
}
