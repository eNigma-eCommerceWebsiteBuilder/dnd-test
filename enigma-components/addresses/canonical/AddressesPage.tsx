import type { AddressesPageData } from './addressesRuntime';
import { AddressesPageState } from './AddressesPageState';
import {
  AddressesAccountLayout,
  AddressesAccountSidebar,
  AddressesBreadcrumbs,
  AddressesContentLayout,
  AddressesManagerRegion,
  AddressesPageLayout,
} from './AddressesPageSections';

export function AddressesPage({ pageData }: { pageData: AddressesPageData }) {
  return (
    <AddressesPageState
      pageData={pageData}
      content={(
        <AddressesPageLayout
          breadcrumbs={<AddressesBreadcrumbs />}
          account={(
            <AddressesAccountLayout
              sidebar={<AddressesAccountSidebar />}
              content={<AddressesContentLayout addressManager={<AddressesManagerRegion pageData={pageData} />} />}
            />
          )}
        />
      )}
    />
  );
}
