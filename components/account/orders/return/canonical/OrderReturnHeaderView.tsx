import { OrderReturnHeader } from '@/enigma-components/returns/order-return-canonical/OrderReturnPageSections';
export const puckComponentName = 'OrderReturnHeader'; export const puckLabel = 'Order Return Header'; export const puckCategory = 'Account'; export const puckFields = {}; export const puckDefaults = {};
export const puckAst = { kind: 'static', sourceJsxNames: ['OrderReturnHeader'], sourceImportPaths: ['@/components/returns/canonical/OrderReturnPageSections'], role: 'order-return-header', slotTarget: 'header', requiredClasses: ['mb-6', 'font-heading', 'text-2xl'] };
export function OrderReturnHeaderView() { return <OrderReturnHeader />; }
