import { AccountOrdersHeader } from '@/enigma-components/orders/AccountOrdersHeader';

export const puckComponentName = 'AccountOrdersHeader';
export const puckLabel = 'Account Orders Header';
export const puckCategory = 'Account';
export const puckFields = {};
export const puckDefaults = {};
export const puckAst = {
  kind: 'static',
  sourceJsxNames: ['AccountOrdersHeader'],
  sourceImportPaths: ['@/components/orders/AccountOrdersHeader'],
  role: 'account-orders-header',
  slotTarget: 'header',
  requiredClasses: ['mb-6', 'md:mb-8', 'font-heading'],
};

export function AccountOrdersHeaderView() {
  return <AccountOrdersHeader />;
}
