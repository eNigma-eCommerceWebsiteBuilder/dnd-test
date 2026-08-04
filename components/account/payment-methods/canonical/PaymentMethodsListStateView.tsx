import type { PaymentMethodsPageData } from '@/enigma-components/payment-methods/canonical/paymentMethodsRuntime';
import { PaymentMethodsListState } from '@/enigma-components/payment-methods/canonical/PaymentMethodsPageSections';
import { loadPaymentMethodsRuntime } from './paymentMethodsRuntime';
import { puckTransparentSlotProps, type PaymentMethodsSlot } from './types';
import { resolvePaymentMethodsPageData } from './viewData';

interface Props { previewState?: 'list' | 'empty'; list?: PaymentMethodsSlot; empty?: PaymentMethodsSlot; pageData?: PaymentMethodsPageData; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'PaymentMethodsListState'; export const puckLabel = 'Saved Cards State'; export const puckCategory = 'Account';
export const puckFields = { previewState: { type: 'select' as const, options: [{ label: 'Saved cards', value: 'list' }, { label: 'No saved cards', value: 'empty' }] }, list: { type: 'slot' as const, allow: ['PaymentMethodsListRegion'] }, empty: { type: 'slot' as const, allow: ['PaymentMethodsEmptyStateRegion'] } }; export const puckDefaults = { previewState: 'list', list: [], empty: [] };
export const puckAst = { kind: 'runtime', slots: ['list', 'empty'], sourceJsxNames: ['PaymentMethodsListState'], sourceImportPaths: ['@/components/payment-methods/canonical/PaymentMethodsPageSections'], role: 'payment-methods-list-state', slotTarget: 'state', conditional: 'paymentMethods.length > 0 ? list : empty', runtimeSignals: ['customer.paymentMethods'] };
export async function puckDataFetcher() { return loadPaymentMethodsRuntime(); }
export function PaymentMethodsListStateView(props: Props) { const value = resolvePaymentMethodsPageData(props); if (!value) return null; const pageData = props.puck?.isEditing ? { ...value, paymentMethods: props.previewState === 'empty' ? [] : value.paymentMethods } : value; return <PaymentMethodsListState pageData={pageData} list={props.list?.(puckTransparentSlotProps)} empty={props.empty?.(puckTransparentSlotProps)} />; }
