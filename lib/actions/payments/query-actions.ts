'use server';

import {
  getPaymentStatus as apiGetPaymentStatus,
  type PaymentStatus,
} from '@/lib/api';
import type { ActionResult } from '@/lib/actions/types';
import {
  createErrorResult,
  createSuccessResult,
} from '@/lib/actions/internal/errors';
import { getActionRequestContext } from '@/lib/actions/internal/request';

export async function getPaymentStatusAction(
  paymentId: string,
  email?: string | null,
): Promise<ActionResult<PaymentStatus>> {
  try {
    const paymentStatus = await apiGetPaymentStatus(
      paymentId,
      email ?? null,
      await getActionRequestContext(),
    );

    return createSuccessResult(paymentStatus);
  } catch (error: unknown) {
    return createErrorResult(
      error instanceof Error ? error.message : 'Failed to check payment status.',
    );
  }
}
