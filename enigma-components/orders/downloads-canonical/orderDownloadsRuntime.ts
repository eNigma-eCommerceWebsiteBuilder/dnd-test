import { getOrder, getOrderDigitalAssets } from '@/lib/api/services/orders';
import type { DigitalAssetsResponse, Order } from '@/lib/api/types';
import { hasDigitalItems } from '@/lib/utils';

export interface OrderDownloadsPageData {
  digitalAssets: DigitalAssetsResponse | null;
  isPaid: boolean;
  order: Order;
}

export function normalizeOrderDownloadsEmail(email?: string | string[]): string | null {
  const value = Array.isArray(email) ? email[0] : email;
  return value?.trim() ? value.trim() : null;
}

// Preserve the original order lookup and no-digital-items availability rule.
export async function fetchOrderDownloadsPageData(id: string, email: string | null): Promise<OrderDownloadsPageData | null> {
  const order = await getOrder(id);
  if (!hasDigitalItems(order)) return null;
  const digitalAssets = await getOrderDigitalAssets(id, email);
  return { digitalAssets, isPaid: digitalAssets?.isPaid ?? false, order };
}
