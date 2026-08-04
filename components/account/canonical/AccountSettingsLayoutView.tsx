import { AccountSettingsLayout } from '@/enigma-components/account/AccountSettingsLayout';
import { puckTransparentSlotProps, type AccountSlot } from './types';

interface Props {
  breadcrumbs?: AccountSlot;
  content?: AccountSlot;
}

export const puckComponentName = 'AccountSettingsLayout';
export const puckLabel = 'Account Settings Layout';
export const puckCategory = 'Account';
export const puckFields = {
  breadcrumbs: { type: 'slot' as const, allow: ['AccountSettingsBreadcrumbs'] },
  content: { type: 'slot' as const, allow: ['AccountIdentitySettingsCard'] },
};
export const puckDefaults = { breadcrumbs: [], content: [] };
export const puckAst = {
  kind: 'static',
  slots: ['breadcrumbs', 'content'],
  sourceJsxNames: ['AccountSettingsLayout'],
  sourceImportPaths: ['@/components/account/AccountSettingsLayout'],
  role: 'account-settings-layout',
  slotTarget: 'content',
  requiredClasses: ['min-h-screen', 'max-w-[1180px]', 'pt-[104px]'],
};

export function AccountSettingsLayoutView({ breadcrumbs, content }: Props) {
  return <AccountSettingsLayout breadcrumbs={breadcrumbs?.(puckTransparentSlotProps)} content={content?.(puckTransparentSlotProps)} />;
}
