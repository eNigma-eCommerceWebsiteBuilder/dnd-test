import type { AccountDashboardData } from './accountDashboardRuntime';
import {
  AccountDashboardHeroLayout,
  AccountDashboardIdentity,
  AccountDashboardLinks,
  AccountDashboardPageLayout,
  AccountDashboardWelcome,
} from './AccountDashboardPageSections';

export function AccountDashboardPage({ data }: { data: AccountDashboardData }) {
  return (
    <AccountDashboardPageLayout
      hero={
        <AccountDashboardHeroLayout
          welcome={<AccountDashboardWelcome firstName={data.firstName} />}
          identity={<AccountDashboardIdentity email={data.email} />}
        />
      }
      links={<AccountDashboardLinks />}
    />
  );
}
