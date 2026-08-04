import { SubscriptionsListLayout as SubscriptionsListLayoutRenderer } from '@/enigma-components/subscriptions/canonical/SubscriptionsPageSections';
import { puckTransparentSlotProps, type AccountSubscriptionsSlot } from './types';

interface Props { content?: AccountSubscriptionsSlot; }

export const puckComponentName = 'SubscriptionsListLayout';
export const puckLabel = 'Subscriptions List Layout';
export const puckCategory = 'Account';
export const puckFields = { content: { type: 'slot' as const, allow: ['SubscriptionsListState'] } };
export const puckDefaults = { content: [] };
export const puckAst = {
  kind: 'static', slots: ['content'], sourceJsxNames: ['SubscriptionsListLayout'],
  sourceImportPaths: ['@/components/subscriptions/canonical/SubscriptionsPageSections'],
  role: 'subscriptions-list-layout', slotTarget: 'content', requiredClasses: ['mt-8', '@container', 'w-full'],
};

export function SubscriptionsListLayout({ content }: Props) {
  return <SubscriptionsListLayoutRenderer content={content?.(puckTransparentSlotProps)} />;
}
