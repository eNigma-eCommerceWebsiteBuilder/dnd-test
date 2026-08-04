import { SubscriptionDetailsPageLayout } from '@/enigma-components/subscriptions/canonical/SubscriptionDetailsPageSections';
import { puckTransparentSlotProps, type SubscriptionDetailSlot } from './types';

interface Props { breadcrumbs?: SubscriptionDetailSlot; header?: SubscriptionDetailSlot; content?: SubscriptionDetailSlot; }

export const puckComponentName = 'SubscriptionDetailsPageLayout';
export const puckLabel = 'Subscription Details Page Layout';
export const puckCategory = 'Account';
export const puckFields = {
  breadcrumbs: { type: 'slot' as const, allow: ['SubscriptionDetailsBreadcrumbs'] },
  header: { type: 'slot' as const, allow: ['SubscriptionDetailHeaderRegion'] },
  content: { type: 'slot' as const, allow: ['SubscriptionDetailContentLayout'] },
};
export const puckDefaults = { breadcrumbs: [], header: [], content: [] };
export const puckAst = {
  kind: 'static', slots: ['breadcrumbs', 'header', 'content'],
  sourceJsxNames: ['SubscriptionDetailsPageLayout'],
  sourceImportPaths: ['@/components/subscriptions/canonical/SubscriptionDetailsPageSections'],
  role: 'subscription-details-page-layout',
  parentSignature: 'SubscriptionDetailsPageState > SubscriptionDetailsPageLayout',
};

export function SubscriptionDetailsPageLayoutView({ breadcrumbs, header, content }: Props) {
  return <SubscriptionDetailsPageLayout breadcrumbs={breadcrumbs?.(puckTransparentSlotProps)} header={header?.(puckTransparentSlotProps)} content={content?.(puckTransparentSlotProps)} />;
}
