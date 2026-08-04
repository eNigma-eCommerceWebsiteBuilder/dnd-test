import { AddressesBreadcrumbs } from '@/enigma-components/addresses/canonical/AddressesPageSections';

export const puckComponentName = 'AddressesBreadcrumbs'; export const puckLabel = 'Addresses Breadcrumbs'; export const puckCategory = 'Account'; export const puckFields = {}; export const puckDefaults = {};
export const puckAst = { kind: 'static', sourceJsxNames: ['AddressesBreadcrumbs'], sourceImportPaths: ['@/components/addresses/canonical/AddressesPageSections'], role: 'addresses-breadcrumbs', slotTarget: 'breadcrumbs', requiredClasses: ['mb-8', 'text-primary'] };
export function AddressesBreadcrumbsView() { return <AddressesBreadcrumbs />; }
