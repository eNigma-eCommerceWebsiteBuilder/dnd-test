import { AccountSubscriptionsPageHeader as AccountSubscriptionsPageHeaderRenderer } from '@/enigma-components/subscriptions/canonical/SubscriptionsPageSections';

export const puckComponentName = 'AccountSubscriptionsPageHeader';
export const puckLabel = 'Account Subscriptions Page Header';
export const puckCategory = 'Account';
export const puckFields = {};
export const puckDefaults = {};
export const puckAst = {
  kind: 'static', sourceJsxNames: ['AccountSubscriptionsPageHeader'],
  sourceImportPaths: ['@/components/subscriptions/canonical/SubscriptionsPageSections'],
  role: 'account-subscriptions-page-header', slotTarget: 'header',
  requiredClasses: ['py-8', 'border-b', 'font-heading'],
};

export function AccountSubscriptionsPageHeader() {
  return <AccountSubscriptionsPageHeaderRenderer />;
}
