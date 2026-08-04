import { AddressesPageLayout } from '@/enigma-components/addresses/canonical/AddressesPageSections';
import { puckTransparentSlotProps, type AddressesSlot } from './types';

interface Props { breadcrumbs?: AddressesSlot; account?: AddressesSlot; }
export const puckComponentName = 'AddressesPageLayout'; export const puckLabel = 'Addresses Page Layout'; export const puckCategory = 'Account';
export const puckFields = { breadcrumbs: { type: 'slot' as const, allow: ['AddressesBreadcrumbs'] }, account: { type: 'slot' as const, allow: ['AddressesAccountLayout'] } }; export const puckDefaults = { breadcrumbs: [], account: [] };
export const puckAst = { kind: 'static', slots: ['breadcrumbs', 'account'], sourceJsxNames: ['AddressesPageLayout'], sourceImportPaths: ['@/components/addresses/canonical/AddressesPageSections'], role: 'addresses-page-layout', requiredClasses: ['min-h-screen', 'max-w-[1440px]', 'sm:px-6', 'lg:px-12'] };
export function AddressesPageLayoutView({ breadcrumbs, account }: Props) { return <AddressesPageLayout breadcrumbs={breadcrumbs?.(puckTransparentSlotProps)} account={account?.(puckTransparentSlotProps)} />; }
