import { AddressesAccountLayout } from '@/enigma-components/addresses/canonical/AddressesPageSections';
import { puckTransparentSlotProps, type AddressesSlot } from './types';

interface Props { sidebar?: AddressesSlot; content?: AddressesSlot; }
export const puckComponentName = 'AddressesAccountLayout'; export const puckLabel = 'Addresses Account Layout'; export const puckCategory = 'Account';
export const puckFields = { sidebar: { type: 'slot' as const, allow: ['AddressesAccountSidebar'] }, content: { type: 'slot' as const, allow: ['AddressesContentLayout'] } }; export const puckDefaults = { sidebar: [], content: [] };
export const puckAst = { kind: 'static', slots: ['sidebar', 'content'], sourceJsxNames: ['AddressesAccountLayout'], sourceImportPaths: ['@/components/addresses/canonical/AddressesPageSections'], role: 'addresses-account-layout', slotTarget: 'account', requiredClasses: ['grid-cols-1', 'lg:grid-cols-12', 'gap-10'] };
export function AddressesAccountLayoutView({ sidebar, content }: Props) { return <AddressesAccountLayout sidebar={sidebar?.(puckTransparentSlotProps)} content={content?.(puckTransparentSlotProps)} />; }
