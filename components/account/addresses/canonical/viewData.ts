import type { AddressesPageData } from '@/enigma-components/addresses/canonical/addressesRuntime';
import { addressesPreview } from './preview';

export interface AddressesRuntimeProps { pageData?: AddressesPageData; puck?: { isEditing?: boolean }; }

export function resolveAddressesPageData({ pageData, puck }: AddressesRuntimeProps): AddressesPageData | null {
  return puck?.isEditing ? addressesPreview : pageData ?? null;
}
