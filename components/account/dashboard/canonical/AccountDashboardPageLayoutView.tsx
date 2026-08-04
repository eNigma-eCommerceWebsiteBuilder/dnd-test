import { AccountDashboardPageLayout as AccountDashboardPageLayoutRenderer } from '@/enigma-components/account/dashboard/canonical/AccountDashboardPageSections';
import { puckTransparentSlotProps, type AccountDashboardSlot } from './types';

interface Props { hero?: AccountDashboardSlot; links?: AccountDashboardSlot; }

export const puckComponentName = 'AccountDashboardPageLayout';
export const puckLabel = 'Account Dashboard Page Layout';
export const puckCategory = 'Account';
export const puckFields = {
  hero: { type: 'slot' as const, allow: ['AccountDashboardHeroLayout'] },
  links: { type: 'slot' as const, allow: ['AccountDashboardLinks'] },
};
export const puckDefaults = { hero: [], links: [] };
export const puckAst = {
  kind: 'static', topLevel: true, slots: ['hero', 'links'],
  sourceJsxNames: ['AccountDashboardPageLayout'],
  sourceImportPaths: ['@/components/account/dashboard/canonical/AccountDashboardPageSections'],
  role: 'account-dashboard-page-layout', requiredClasses: ['min-h-screen', 'max-w-[1180px]', 'pt-[96px]'],
};

export function AccountDashboardPageLayout({ hero, links }: Props) {
  return <AccountDashboardPageLayoutRenderer hero={hero?.(puckTransparentSlotProps)} links={links?.(puckTransparentSlotProps)} />;
}
