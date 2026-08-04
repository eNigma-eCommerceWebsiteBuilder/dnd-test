import type { AddressesPageData } from '@/enigma-components/addresses/canonical/addressesRuntime';
import { AddressesPageState } from '@/enigma-components/addresses/canonical/AddressesPageState';
import { loadAddressesRuntime } from './addressesRuntime';
import { puckTransparentSlotProps, type AddressesSlot } from './types';
import { resolveAddressesPageData } from './viewData';

interface Props { content?: AddressesSlot; pageData?: AddressesPageData; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'AddressesPageState'; export const puckLabel = 'Addresses Page State'; export const puckCategory = 'Account';
export const puckFields = { content: { type: 'slot' as const, allow: ['AddressesPageLayout'] } }; export const puckDefaults = { content: [] };
export const puckAst = { kind: 'runtime', topLevel: true, slots: ['content'], sourceJsxNames: ['AddressesPageState'], sourceImportPaths: ['@/components/addresses/canonical/AddressesPageState'], role: 'addresses-page-state', runtimeSignals: ['user.profile', 'user.addresses'] };
export async function puckDataFetcher() { return loadAddressesRuntime(); }
export function AddressesPageStateView(props: Props) { const pageData = resolveAddressesPageData(props); return pageData ? <AddressesPageState pageData={pageData} content={props.content?.(puckTransparentSlotProps)} /> : null; }
