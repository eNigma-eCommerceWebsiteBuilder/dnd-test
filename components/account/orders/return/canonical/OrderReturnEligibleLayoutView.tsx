import { OrderReturnEligibleLayout } from '@/enigma-components/returns/order-return-canonical/OrderReturnPageSections';
import { puckTransparentSlotProps, type OrderReturnSlot } from './types';
interface Props { form?: OrderReturnSlot; policy?: OrderReturnSlot; }
export const puckComponentName = 'OrderReturnEligibleLayout'; export const puckLabel = 'Order Return Eligible Layout'; export const puckCategory = 'Account'; export const puckFields = { form: { type: 'slot' as const, allow: ['OrderReturnRequestFormRegion'] }, policy: { type: 'slot' as const, allow: ['OrderReturnPolicyReminderRegion'] } }; export const puckDefaults = { form: [], policy: [] };
export const puckAst = { kind: 'static', slots: ['form', 'policy'], sourceJsxNames: ['OrderReturnEligibleLayout'], sourceImportPaths: ['@/components/returns/canonical/OrderReturnPageSections'], role: 'order-return-eligible-layout', slotTarget: 'eligible', requiredClasses: ['flex', 'flex-col', 'gap-6'] };
export function OrderReturnEligibleLayoutView({ form, policy }: Props) { return <OrderReturnEligibleLayout form={form?.(puckTransparentSlotProps)} policy={policy?.(puckTransparentSlotProps)} />; }
