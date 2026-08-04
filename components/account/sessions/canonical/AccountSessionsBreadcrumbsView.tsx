import { AccountSessionsBreadcrumbs as AccountSessionsBreadcrumbsRenderer } from '@/enigma-components/account/sessions/canonical/AccountSessionsPageSections';

export const puckComponentName = 'AccountSessionsBreadcrumbs';
export const puckLabel = 'Account Sessions Breadcrumbs';
export const puckCategory = 'Account';
export const puckFields = {};
export const puckDefaults = {};
export const puckAst = {
  kind: 'static', sourceJsxNames: ['AccountSessionsBreadcrumbs', 'Link'],
  sourceImportPaths: ['@/components/account/sessions/canonical/AccountSessionsPageSections', 'next/link'],
  role: 'account-sessions-breadcrumbs', slotTarget: 'breadcrumbs', requiredClasses: ['text-sm', 'text-text-muted', 'hover:text-primary'],
};

export function AccountSessionsBreadcrumbs() {
  return <AccountSessionsBreadcrumbsRenderer />;
}
