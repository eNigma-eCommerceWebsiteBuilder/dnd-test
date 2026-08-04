import { siteContent } from '@/lib/content';
import { AuthEntryCard } from '@/enigma-components/auth/AuthEntryCard';

export const puckComponentName = 'AuthEntryCard';
export const puckLabel = 'Auth Entry Card';
export const puckCategory = 'Auth';
export const puckFields = {};
export const puckDefaults = {};
export const puckAst = {
  kind: 'runtime',
  sourceJsxNames: ['AuthEntryCard'],
  sourceImportPaths: ['@/components/auth/AuthEntryCard'],
  role: 'auth-entry-card',
  slotTarget: 'content',
  runtimeSignals: ['searchParams.mode', 'searchParams.returnUrl', 'nextAuth.signIn'],
};

// The production card owns hosted-identity actions and URL-driven login/register mode.
export function AuthEntryCardView() {
  return <AuthEntryCard content={siteContent.auth} />;
}
