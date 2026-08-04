import { AccountSubscriptionsPageLayout as AccountSubscriptionsPageLayoutRenderer } from '@/enigma-components/subscriptions/canonical/SubscriptionsPageSections';
import { puckTransparentSlotProps, type AccountSubscriptionsSlot } from './types';

interface Props { header?: AccountSubscriptionsSlot; content?: AccountSubscriptionsSlot; }

export const puckComponentName = 'AccountSubscriptionsPageLayout';
export const puckLabel = 'Account Subscriptions Page Layout';
export const puckCategory = 'Account';
export const puckFields = {
  header: { type: 'slot' as const, allow: ['AccountSubscriptionsPageHeader'] },
  content: { type: 'slot' as const, allow: ['SubscriptionsListLayout'] },
};
export const puckDefaults = { header: [], content: [] };
export const puckAst = {
  kind: 'static', topLevel: true, slots: ['header', 'content'],
  sourceJsxNames: ['AccountSubscriptionsPageLayout'],
  sourceImportPaths: ['@/components/subscriptions/canonical/SubscriptionsPageSections'],
  role: 'account-subscriptions-page-layout',
  requiredClasses: ['min-h-screen', 'max-w-[1440px]', 'lg:px-12'],
};

export function AccountSubscriptionsPageLayout({ header, content }: Props) {
  return <AccountSubscriptionsPageLayoutRenderer header={header?.(puckTransparentSlotProps)} content={content?.(puckTransparentSlotProps)} />;
}
