import { SubscriptionsEmptyRegion as SubscriptionsEmptyRegionRenderer } from '@/enigma-components/subscriptions/canonical/SubscriptionsPageSections';

export const puckComponentName = 'SubscriptionsEmptyRegion';
export const puckLabel = 'Subscriptions Empty State';
export const puckCategory = 'Account';
export const puckFields = {};
export const puckDefaults = {};
export const puckAst = {
  kind: 'static', sourceJsxNames: ['SubscriptionsEmptyRegion', 'SubscriptionsEmpty'],
  sourceImportPaths: ['@/components/subscriptions/canonical/SubscriptionsPageSections', '@/components/subscriptions/SubscriptionsEmpty'],
  role: 'subscriptions-empty-region', slotTarget: 'empty',
};

export function SubscriptionsEmptyRegion() {
  return <SubscriptionsEmptyRegionRenderer />;
}
