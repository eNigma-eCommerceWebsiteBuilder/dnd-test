import type {
  ReturnRequest,
  ReturnRequestData,
  ReturnStatus,
  ReturnsListResponse,
} from '@/lib/api/types/returns';
import type { ExchangeItem } from '@/lib/api/types/orders';
import type { RefundEstimateItem } from './shared';

export interface ExchangeReturnedItem {
  productId: string;
  variantId?: string;
  quantity: number;
  reason?: string;
}

export interface UseReturnsReturn {
  returns: ReturnsListResponse['data'];
  loading: boolean;
  filter: ReturnStatus | null;
  error: string | null;
  loadReturns: (status?: ReturnStatus, page?: number, limit?: number) => Promise<void>;
  filterByStatus: (status: ReturnStatus | null) => void;
  refreshReturns: () => Promise<void>;
  clearError: () => void;
}

export interface UseReturnRequestReturn {
  submitting: boolean;
  validationErrors: string[];
  error: string | null;
  requestReturn: (orderId: string, returnData: ReturnRequestData) => Promise<ReturnRequest>;
  validateReturnEligibility: (orderId: string) => Promise<boolean>;
  calculateRefund: (orderId: string, items: RefundEstimateItem[]) => Promise<number>;
  clearErrors: () => void;
}

export interface UseReturnDetailsReturn {
  returnDetails: ReturnRequest | null;
  loading: boolean;
  error: string | null;
  loadDetails: (returnId: string) => Promise<void>;
  refreshDetails: () => Promise<void>;
  clearError: () => void;
}

export interface UseReturnActionsReturn {
  cancelling: boolean;
  error: string | null;
  cancelReturn: (returnId: string) => Promise<void>;
  canCancel: (status: ReturnStatus) => boolean;
  clearError: () => void;
}

export interface UseExchangeRequestReturn {
  exchangeCart: ExchangeItem[];
  priceDifference: number;
  submitting: boolean;
  error: string | null;
  addExchangeItem: (productId: string, variantId?: string, quantity?: number) => void;
  removeExchangeItem: (productId: string) => void;
  calculatePriceDifference: () => number;
  submitExchange: (
    orderId: string,
    itemsReturned: ExchangeReturnedItem[],
    email?: string,
    reason?: string
  ) => Promise<void>;
  clearCart: () => void;
  clearError: () => void;
}
