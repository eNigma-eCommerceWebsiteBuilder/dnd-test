import { AccountDashboardLinks as AccountDashboardLinksRenderer } from '@/enigma-components/account/dashboard/canonical/AccountDashboardPageSections';

export const puckComponentName = 'AccountDashboardLinks';
export const puckLabel = 'Account Dashboard Links';
export const puckCategory = 'Account';
export const puckFields = {};
export const puckDefaults = {};
export const puckAst = {
  kind: 'static', sourceJsxNames: ['AccountDashboardLinks', 'Link'],
  sourceImportPaths: ['@/components/account/dashboard/canonical/AccountDashboardPageSections', 'next/link'],
  role: 'account-dashboard-links', slotTarget: 'links', runtimeSignals: ['accountDashboardLinks.map'],
  requiredClasses: ['@container', '@3xl:grid-cols-2', 'hover:-translate-y-0.5'],
};

export function AccountDashboardLinks() {
  return <AccountDashboardLinksRenderer />;
}
