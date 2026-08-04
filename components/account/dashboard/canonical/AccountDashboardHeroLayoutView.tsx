import { AccountDashboardHeroLayout as AccountDashboardHeroLayoutRenderer } from '@/enigma-components/account/dashboard/canonical/AccountDashboardPageSections';
import { puckTransparentSlotProps, type AccountDashboardSlot } from './types';

interface Props { welcome?: AccountDashboardSlot; identity?: AccountDashboardSlot; }

export const puckComponentName = 'AccountDashboardHeroLayout';
export const puckLabel = 'Account Dashboard Hero Layout';
export const puckCategory = 'Account';
export const puckFields = {
  welcome: { type: 'slot' as const, allow: ['AccountDashboardWelcome'] },
  identity: { type: 'slot' as const, allow: ['AccountDashboardIdentity'] },
};
export const puckDefaults = { welcome: [], identity: [] };
export const puckAst = {
  kind: 'static', slots: ['welcome', 'identity'], sourceJsxNames: ['AccountDashboardHeroLayout'],
  sourceImportPaths: ['@/components/account/dashboard/canonical/AccountDashboardPageSections'],
  role: 'account-dashboard-hero-layout', slotTarget: 'hero',
  requiredClasses: ['@container', '@4xl:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]', 'shadow-card'],
};

export function AccountDashboardHeroLayout({ welcome, identity }: Props) {
  return <AccountDashboardHeroLayoutRenderer welcome={welcome?.(puckTransparentSlotProps)} identity={identity?.(puckTransparentSlotProps)} />;
}
