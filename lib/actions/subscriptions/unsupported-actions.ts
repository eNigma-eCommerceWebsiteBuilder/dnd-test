'use server';

import type {
  ActionResult,
  ActionState,
  FormDataOrObject,
  SubscriptionActionResult,
} from '@/lib/actions/types';
import { createUnsupportedActionResult } from '@/lib/actions/internal/unsupported';
import { SUBSCRIPTION_UNSUPPORTED_MESSAGES } from './shared';

export async function getBillingPortalAction(
  returnUrl?: string,
): Promise<ActionResult<{ url: string }>> {
  void returnUrl;

  return createUnsupportedActionResult(SUBSCRIPTION_UNSUPPORTED_MESSAGES.billingPortal);
}

export async function skipNextDeliveryAction(
  prevState: ActionState<SubscriptionActionResult>,
  formData: FormDataOrObject<{ subscriptionId?: string }>,
): Promise<SubscriptionActionResult> {
  void prevState;
  void formData;

  return createUnsupportedActionResult(SUBSCRIPTION_UNSUPPORTED_MESSAGES.skipNext);
}

export async function updateSubscriptionPaymentAction(
  prevState: ActionState<SubscriptionActionResult>,
  formData: FormDataOrObject<{ subscriptionId?: string; paymentMethodId?: string }>,
): Promise<SubscriptionActionResult> {
  void prevState;
  void formData;

  return createUnsupportedActionResult(SUBSCRIPTION_UNSUPPORTED_MESSAGES.paymentMethod);
}
