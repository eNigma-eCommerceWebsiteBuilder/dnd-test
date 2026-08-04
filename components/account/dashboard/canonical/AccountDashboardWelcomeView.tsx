import { AccountDashboardWelcome as AccountDashboardWelcomeRenderer } from '@/enigma-components/account/dashboard/canonical/AccountDashboardPageSections';
import type { AccountDashboardData } from '@/enigma-components/account/dashboard/canonical/accountDashboardRuntime';
import { resolveAccountDashboardData } from './viewData';

interface Props { data?: AccountDashboardData | null; puck?: { isEditing?: boolean }; }

export const puckComponentName = 'AccountDashboardWelcome';
export const puckLabel = 'Account Dashboard Welcome';
export const puckCategory = 'Account';
export const puckFields = {};
export const puckDefaults = {};
export const puckAst = {
  kind: 'runtime', sourceJsxNames: ['AccountDashboardWelcome'],
  sourceImportPaths: ['@/components/account/dashboard/canonical/AccountDashboardPageSections'],
  role: 'account-dashboard-welcome', slotTarget: 'welcome', runtimeSignals: ['session.user.firstName', 'session.user.name'],
  conditional: 'session?.user?.firstName || session?.user?.name || there',
};
export const puckServerDataFetcher = { importPath: '@/components/account/dashboard/canonical/accountDashboardFetcher.server', exportName: 'puckDataFetcher' };

export function AccountDashboardWelcome(props: Props) {
  const data = resolveAccountDashboardData(props);
  return data ? <AccountDashboardWelcomeRenderer firstName={data.firstName} /> : null;
}
