import { AccountSettingsBreadcrumbs } from '@/enigma-components/account/AccountSettingsBreadcrumbs';

export const puckComponentName = 'AccountSettingsBreadcrumbs';
export const puckLabel = 'Account Settings Breadcrumbs';
export const puckCategory = 'Account';
export const puckFields = {};
export const puckDefaults = {};
export const puckAst = {
  kind: 'static',
  sourceJsxNames: ['AccountSettingsBreadcrumbs'],
  sourceImportPaths: ['@/components/account/AccountSettingsBreadcrumbs'],
  role: 'account-settings-breadcrumbs',
  slotTarget: 'breadcrumbs',
};

export function AccountSettingsBreadcrumbsView() {
  return <AccountSettingsBreadcrumbs />;
}
