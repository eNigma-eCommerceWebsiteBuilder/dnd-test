import type { OrderReturnPageData } from '@/enigma-components/returns/order-return-canonical/orderReturnRuntime';
import { orderReturnPreview } from './preview';
export interface OrderReturnRuntimeProps { pageData?: OrderReturnPageData | null; puck?: { isEditing?: boolean }; }
export function resolveOrderReturnPageData({ pageData = null, puck }: OrderReturnRuntimeProps): OrderReturnPageData | null { return puck?.isEditing ? orderReturnPreview : pageData; }
