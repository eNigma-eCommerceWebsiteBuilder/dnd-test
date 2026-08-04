import { AccountSessionsIdentityNotice as AccountSessionsIdentityNoticeRenderer } from '@/enigma-components/account/sessions/canonical/AccountSessionsPageSections';

export const puckComponentName = 'AccountSessionsIdentityNotice';
export const puckLabel = 'Account Sessions Identity Notice';
export const puckCategory = 'Account';
export const puckFields = {};
export const puckDefaults = {};
export const puckAst = {
  kind: 'static', sourceJsxNames: ['AccountSessionsIdentityNotice'],
  sourceImportPaths: ['@/components/account/sessions/canonical/AccountSessionsPageSections'],
  role: 'account-sessions-identity-notice', slotTarget: 'content',
  requiredClasses: ['@container', 'rounded-card', 'shadow-card', 'tracking-[0.35em]'],
};

export function AccountSessionsIdentityNotice() {
  return <AccountSessionsIdentityNoticeRenderer />;
}
