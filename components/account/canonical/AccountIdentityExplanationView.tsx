import { AccountIdentityExplanation } from '@/enigma-components/account/AccountIdentityExplanation';

export const puckComponentName = 'AccountIdentityExplanation';
export const puckLabel = 'Account Identity Explanation';
export const puckCategory = 'Account';
export const puckFields = {};
export const puckDefaults = {};
export const puckAst = {
  kind: 'static',
  sourceJsxNames: ['AccountIdentityExplanation'],
  sourceImportPaths: ['@/components/account/AccountIdentityExplanation'],
  role: 'account-identity-explanation',
  slotTarget: 'explanation',
};

export function AccountIdentityExplanationView() {
  return <AccountIdentityExplanation />;
}
