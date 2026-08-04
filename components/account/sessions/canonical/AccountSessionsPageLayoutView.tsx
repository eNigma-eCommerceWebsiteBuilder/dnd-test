import { AccountSessionsPageLayout as AccountSessionsPageLayoutRenderer } from '@/enigma-components/account/sessions/canonical/AccountSessionsPageSections';
import { puckTransparentSlotProps, type AccountSessionsSlot } from './types';

interface Props { breadcrumbs?: AccountSessionsSlot; content?: AccountSessionsSlot; }

export const puckComponentName = 'AccountSessionsPageLayout';
export const puckLabel = 'Account Sessions Page Layout';
export const puckCategory = 'Account';
export const puckFields = {
  breadcrumbs: { type: 'slot' as const, allow: ['AccountSessionsBreadcrumbs'] },
  content: { type: 'slot' as const, allow: ['AccountSessionsIdentityNotice'] },
};
export const puckDefaults = { breadcrumbs: [], content: [] };
export const puckAst = {
  kind: 'static', topLevel: true, slots: ['breadcrumbs', 'content'],
  sourceJsxNames: ['AccountSessionsPageLayout'],
  sourceImportPaths: ['@/components/account/sessions/canonical/AccountSessionsPageSections'],
  role: 'account-sessions-page-layout', requiredClasses: ['min-h-screen', 'max-w-[980px]', 'pt-[104px]'],
};

export function AccountSessionsPageLayout({ breadcrumbs, content }: Props) {
  return <AccountSessionsPageLayoutRenderer breadcrumbs={breadcrumbs?.(puckTransparentSlotProps)} content={content?.(puckTransparentSlotProps)} />;
}
