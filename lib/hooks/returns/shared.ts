import { ReturnRequestStatus, type ReturnStatus } from '@/lib/api/types/returns';
import { getErrorMessage } from '@/lib/hooks/internal/errors';

export interface RefundEstimateItem {
  price: number;
  quantity: number;
  tax?: number;
}

export function getReturnErrorMessage(error: unknown, fallback: string): string {
  return getErrorMessage(error, fallback);
}

export function canCancelReturn(status: ReturnStatus): boolean {
  return (
    status === ReturnRequestStatus.PENDING ||
    status === ReturnRequestStatus.APPROVED
  );
}
