import { AccountOrdersLayout } from '@/enigma-components/orders/AccountOrdersLayout';
import { puckTransparentSlotProps, type AccountOrdersSlot } from './types';

interface Props {
  header?: AccountOrdersSlot;
  filters?: AccountOrdersSlot;
  content?: AccountOrdersSlot;
}

export const puckComponentName = 'AccountOrdersLayout';
export const puckLabel = 'Account Orders Layout';
export const puckCategory = 'Account';
export const puckFields = {
  header: { type: 'slot' as const, allow: ['AccountOrdersHeader'] },
  filters: { type: 'slot' as const, allow: ['AccountOrdersStatusFilter'] },
  content: { type: 'slot' as const, allow: ['AccountOrdersResultsState'] },
};
export const puckDefaults = { header: [], filters: [], content: [] };
export const puckAst = {
  kind: 'static',
  slots: ['header', 'filters', 'content'],
  sourceJsxNames: ['AccountOrdersLayout'],
  sourceImportPaths: ['@/components/orders/AccountOrdersLayout'],
  role: 'account-orders-layout',
  requiredClasses: ['min-h-screen', 'max-w-[1440px]', 'sm:px-6', 'lg:px-12'],
};

export function AccountOrdersLayoutView({ header, filters, content }: Props) {
  return <AccountOrdersLayout header={header?.(puckTransparentSlotProps)} filters={filters?.(puckTransparentSlotProps)} content={content?.(puckTransparentSlotProps)} />;
}
