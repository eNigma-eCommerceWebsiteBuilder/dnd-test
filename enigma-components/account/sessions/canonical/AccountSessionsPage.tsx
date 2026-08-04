import {
  AccountSessionsBreadcrumbs,
  AccountSessionsIdentityNotice,
  AccountSessionsPageLayout,
} from './AccountSessionsPageSections';

export function AccountSessionsPage() {
  return (
    <AccountSessionsPageLayout
      breadcrumbs={<AccountSessionsBreadcrumbs />}
      content={<AccountSessionsIdentityNotice />}
    />
  );
}
