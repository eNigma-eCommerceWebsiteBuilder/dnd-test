import { AccountDashboardIdentity as AccountDashboardIdentityRenderer } from '@/enigma-components/account/dashboard/canonical/AccountDashboardPageSections';
import type { AccountDashboardData } from '@/enigma-components/account/dashboard/canonical/accountDashboardRuntime';
import { resolveAccountDashboardData } from './viewData';

interface Props { data?: AccountDashboardData | null; puck?: { isEditing?: boolean }; }

export const puckComponentName = 'AccountDashboardIdentity';
export const puckLabel = 'Account Dashboard Identity';
export const puckCategory = 'Account';
export const puckFields = {};
export const puckDefaults = {};
export const puckAst = {
  kind: 'runtime', sourceJsxNames: ['AccountDashboardIdentity'],
  sourceImportPaths: ['@/components/account/dashboard/canonical/AccountDashboardPageSections'],
  role: 'account-dashboard-identity', slotTarget: 'identity', runtimeSignals: ['session.user.email'],
};
export const puckServerDataFetcher = { importPath: '@/components/account/dashboard/canonical/accountDashboardFetcher.server', exportName: 'puckDataFetcher' };

export function AccountDashboardIdentity(props: Props) {
  const data = resolveAccountDashboardData(props);
  return data ? <AccountDashboardIdentityRenderer email={data.email} /> : null;
}
