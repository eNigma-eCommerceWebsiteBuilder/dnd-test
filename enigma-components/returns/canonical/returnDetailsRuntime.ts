import { getReturnDetails } from '@/lib/api/services/returns';
import type { Order } from '@/lib/api/types/orders';
import type { ReturnRequest } from '@/lib/api/types/returns';

// This mirrors the route's data fetch and populated-order guard. Puck adapters
// use the same contract with the dynamic return id instead of serializing data.
export async function fetchReturnDetails(id: string): Promise<ReturnRequest> {
  try {
    return await getReturnDetails(id);
  } catch (error) {
    console.error('Error fetching return details:', error);
    throw error;
  }
}

export function getReturnOrder(returnDetails: ReturnRequest): Order | null {
  return typeof returnDetails.orderId === 'object'
    && returnDetails.orderId !== null
    && 'items' in returnDetails.orderId
    ? returnDetails.orderId as Order
    : null;
}
