'use server';

import type { ActionResult, ActionState } from '@/lib/actions/types';
import { createUnsupportedActionResult } from '@/lib/actions/internal/unsupported';

const PAYMENT_METHODS_UNSUPPORTED_MESSAGE =
  'Customer payment-method management is not backed by a documented REAL customer API in this project yet.';

export async function addPaymentMethodAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionResult> {
  void prevState;
  void formData;

  return createUnsupportedActionResult(PAYMENT_METHODS_UNSUPPORTED_MESSAGE);
}

export async function deletePaymentMethodAction(
  paymentMethodId: string,
): Promise<ActionResult> {
  void paymentMethodId;

  return createUnsupportedActionResult(PAYMENT_METHODS_UNSUPPORTED_MESSAGE);
}

export async function setDefaultPaymentMethodAction(
  paymentMethodId: string,
): Promise<ActionResult> {
  void paymentMethodId;

  return createUnsupportedActionResult(PAYMENT_METHODS_UNSUPPORTED_MESSAGE);
}
