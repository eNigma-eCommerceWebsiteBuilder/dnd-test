import { AddressesContentLayout } from '@/enigma-components/addresses/canonical/AddressesPageSections';
import { puckTransparentSlotProps, type AddressesSlot } from './types';

interface Props { addressManager?: AddressesSlot; }
export const puckComponentName = 'AddressesContentLayout'; export const puckLabel = 'Addresses Content Layout'; export const puckCategory = 'Account';
export const puckFields = { addressManager: { type: 'slot' as const, allow: ['AddressesManagerRegion'] } }; export const puckDefaults = { addressManager: [] };
export const puckAst = { kind: 'static', slots: ['addressManager'], sourceJsxNames: ['AddressesContentLayout'], sourceImportPaths: ['@/components/addresses/canonical/AddressesPageSections'], role: 'addresses-content-layout', slotTarget: 'content', requiredClasses: ['lg:col-span-9', 'font-heading', 'text-2xl'] };
export function AddressesContentLayoutView({ addressManager }: Props) { return <AddressesContentLayout addressManager={addressManager?.(puckTransparentSlotProps)} />; }
