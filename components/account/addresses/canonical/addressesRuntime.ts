import { cache } from 'react';
import { fetchAddressesPageData, type AddressesPageData } from '@/enigma-components/addresses/canonical/addressesRuntime';

export interface AddressesRuntime { pageData: AddressesPageData; }

const load = cache(async (): Promise<AddressesRuntime> => ({ pageData: await fetchAddressesPageData() }));

export function loadAddressesRuntime(): Promise<AddressesRuntime> { return load(); }
