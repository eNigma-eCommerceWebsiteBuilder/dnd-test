import { OrderDetailsPageLayout } from '@/enigma-components/orders/canonical/OrderDetailsPageSections';
import { puckTransparentSlotProps, type OrderDetailsSlot } from './types';

interface Props { breadcrumbs?: OrderDetailsSlot; header?: OrderDetailsSlot; content?: OrderDetailsSlot; }

export const puckComponentName = 'OrderDetailsPageLayout';
export const puckLabel = 'Order Details Page Layout';
export const puckCategory = 'Account';
export const puckFields = {
  breadcrumbs: { type: 'slot' as const, allow: ['OrderDetailsBreadcrumbs'] },
  header: { type: 'slot' as const, allow: ['OrderDetailsHeader'] },
  content: { type: 'slot' as const, allow: ['OrderDetailsContentLayout'] },
};
export const puckDefaults = { breadcrumbs: [], header: [], content: [] };
export const puckAst = {
  kind: 'static', slots: ['breadcrumbs', 'header', 'content'],
  sourceJsxNames: ['OrderDetailsPageLayout'],
  sourceImportPaths: ['@/components/orders/canonical/OrderDetailsPageSections'],
  role: 'order-details-page-layout',
  requiredClasses: ['min-h-screen', 'max-w-[1440px]', 'sm:px-6', 'lg:px-12'],
};

export function OrderDetailsPageLayoutView({ breadcrumbs, header, content }: Props) {
  return <OrderDetailsPageLayout breadcrumbs={breadcrumbs?.(puckTransparentSlotProps)} header={header?.(puckTransparentSlotProps)} content={content?.(puckTransparentSlotProps)} />;
}
