import type { SubscriptionDetailsPageData } from '@/enigma-components/subscriptions/canonical/subscriptionDetailsRuntime';
import { SubscriptionCancelAction } from '@/enigma-components/subscriptions/canonical/SubscriptionDetailsPageSections';
import { loadSubscriptionDetailsRuntime } from './subscriptionDetailsRuntime';
import { resolveSubscriptionDetailsPageData } from './viewData';
interface Props { pageData?: SubscriptionDetailsPageData | null; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'SubscriptionCancelAction'; export const puckLabel = 'Cancel Subscription'; export const puckCategory = 'Account'; export const puckFields = {}; export const puckDefaults = {};
export const puckAst = { kind: 'runtime', sourceJsxNames: ['SubscriptionCancelAction', 'CancelButton'], sourceImportPaths: ['@/components/subscriptions/canonical/SubscriptionDetailsPageSections'], role: 'subscription-details-cancel-action', slotTarget: 'cancel', runtimeSignals: ['params.id'] };
export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadSubscriptionDetailsRuntime>[0]) { return loadSubscriptionDetailsRuntime(context); }
export function SubscriptionCancelActionView(props: Props) { const subscription = resolveSubscriptionDetailsPageData(props)?.details.subscription; return subscription ? <SubscriptionCancelAction subscriptionId={subscription._id} /> : null; }
