import type { AddressesPageData } from '@/enigma-components/addresses/canonical/addressesRuntime';
import { AddressesManagerRegion } from '@/enigma-components/addresses/canonical/AddressesPageSections';
import { loadAddressesRuntime } from './addressesRuntime';
import { resolveAddressesPageData } from './viewData';

interface Props { pageData?: AddressesPageData; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'AddressesManagerRegion'; export const puckLabel = 'Address Manager'; export const puckCategory = 'Account'; export const puckFields = {}; export const puckDefaults = {};
export const puckAst = { kind: 'runtime', sourceJsxNames: ['AddressesManagerRegion', 'AddressManager'], sourceImportPaths: ['@/components/addresses/canonical/AddressesPageSections'], role: 'addresses-manager-region', slotTarget: 'addressManager', runtimeSignals: ['user.profile', 'user.addresses', 'address.add', 'address.delete'] };
export async function puckDataFetcher() { return loadAddressesRuntime(); }
export function AddressesManagerRegionView(props: Props) { const pageData = resolveAddressesPageData(props); return pageData ? <AddressesManagerRegion pageData={pageData} /> : null; }
