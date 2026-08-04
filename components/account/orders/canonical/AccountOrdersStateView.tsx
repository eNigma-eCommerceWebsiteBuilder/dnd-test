import { AccountOrdersState } from './AccountOrdersState';
import { puckTransparentSlotProps, type AccountOrdersSlot } from './types';

interface Props {
  content?: AccountOrdersSlot;
}

export const puckComponentName = 'AccountOrdersState';
export const puckLabel = 'Account Orders State';
export const puckCategory = 'Account';
export const puckFields = {
  content: { type: 'slot' as const, allow: ['AccountOrdersLayout'] },
};
export const puckDefaults = { content: [] };
export const puckAst = {
  kind: 'runtime',
  topLevel: true,
  slots: ['content'],
  sourceImportPaths: ['app/account/orders/page.tsx'],
  role: 'account-orders-state',
  runtimeSignals: ['searchParams.status', 'searchParams.page', 'requestCookies'],
};

export function AccountOrdersStateView({ content }: Props) {
  return <AccountOrdersState content={content?.(puckTransparentSlotProps)} />;
}
