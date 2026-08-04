import { getOrder } from '@/lib/api/services/orders';
import type { Order } from '@/lib/api/types/orders';
import { RETURNS } from '@/lib/utils/constants';
import { calculateReturnDeadline, validateReturnEligibility } from '@/lib/utils/returns';

export interface OrderReturnPageData {
  order: Order | null;
  returnWindowDays: number;
  deadline: Date | null;
  isWindowExpired: boolean;
  eligibility: ReturnType<typeof validateReturnEligibility>;
}

export function buildOrderReturnPageData(order: Order | null): OrderReturnPageData {
  const returnWindowDays = RETURNS.WINDOW_DAYS;
  if (!order) {
    return {
      order,
      returnWindowDays,
      deadline: null,
      isWindowExpired: false,
      eligibility: { valid: false, error: 'Order not found' },
    };
  }

  const orderDate = order.deliveredAt || order.createdAt;
  const deadline = calculateReturnDeadline(orderDate, returnWindowDays);
  const isWindowExpired = new Date() > deadline;
  const itemsForValidation = order.items.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
  }));

  return {
    order,
    returnWindowDays,
    deadline,
    isWindowExpired,
    eligibility: validateReturnEligibility(order, itemsForValidation, returnWindowDays),
  };
}

// Keep the route's original fetch logging and error propagation intact.
export async function fetchOrderReturnPageData(id: string): Promise<OrderReturnPageData> {
  try {
    return buildOrderReturnPageData(await getOrder(id));
  } catch (error) {
    console.error('Error fetching order for return request:', error);
    throw error;
  }
}
