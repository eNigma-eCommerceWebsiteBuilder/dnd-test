import type { OrderDownloadsPageData } from '@/enigma-components/orders/downloads-canonical/orderDownloadsRuntime';
import { orderDownloadsPreview } from './preview';
export interface OrderDownloadsRuntimeProps { data?: OrderDownloadsPageData | null; puck?: { isEditing?: boolean }; }
export function resolveOrderDownloadsData({ data = null, puck }: OrderDownloadsRuntimeProps): OrderDownloadsPageData | null { return puck?.isEditing ? orderDownloadsPreview : data; }
