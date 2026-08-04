import { OrderEmpty } from '@/enigma-components/orders/OrderEmpty';

export const puckComponentName = 'AccountOrdersEmpty';
export const puckLabel = 'Account Orders Empty State';
export const puckCategory = 'Account';
export const puckFields = {};
export const puckDefaults = {};
export const puckAst = {
  kind: 'static',
  sourceJsxNames: ['OrderEmpty'],
  sourceImportPaths: ['@/components/orders/OrderEmpty'],
  role: 'account-orders-empty',
  slotTarget: 'empty',
};

export function AccountOrdersEmptyView() {
  return <OrderEmpty />;
}
