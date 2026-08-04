import { getOrder } from '@/lib/api/services/orders';
import type { Order } from '@/lib/api/types/orders';

// This is the route's source data contract. Puck adapters mirror it with the
// dynamic order id instead of serializing a backend response into a seed.
export async function fetchOrderDetails(id: string): Promise<Order> {
  return getOrder(id);
}

export function formatOrderPlacedDate(createdAt: string): string {
  return new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
