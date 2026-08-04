import { AccountSettingsState } from './AccountSettingsState';
import { puckTransparentSlotProps, type AccountSlot } from './types';

interface Props {
  content?: AccountSlot;
}

export const puckComponentName = 'AccountSettingsState';
export const puckLabel = 'Account Settings State';
export const puckCategory = 'Account';
export const puckFields = {
  content: { type: 'slot' as const, allow: ['AccountSettingsLayout'] },
};
export const puckDefaults = { content: [] };
export const puckAst = {
  kind: 'runtime',
  topLevel: true,
  slots: ['content'],
  sourceImportPaths: ['app/account/settings/page.tsx'],
  role: 'account-settings-state',
  runtimeSignals: ['session.user'],
};

export function AccountSettingsStateView({ content }: Props) {
  return <AccountSettingsState content={content?.(puckTransparentSlotProps)} />;
}
