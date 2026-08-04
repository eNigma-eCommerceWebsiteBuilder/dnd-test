import { AddressesAccountSidebar } from '@/enigma-components/addresses/canonical/AddressesPageSections';

export const puckComponentName = 'AddressesAccountSidebar'; export const puckLabel = 'Addresses Account Sidebar'; export const puckCategory = 'Account'; export const puckFields = {}; export const puckDefaults = {};
export const puckAst = { kind: 'static', sourceJsxNames: ['AddressesAccountSidebar'], sourceImportPaths: ['@/components/addresses/canonical/AddressesPageSections'], role: 'addresses-account-sidebar', slotTarget: 'sidebar', requiredClasses: ['sticky', 'top-28', 'space-y-6'] };
export function AddressesAccountSidebarView() { return <AddressesAccountSidebar />; }
