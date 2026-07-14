'use server';

import type {
  ActionState,
  FormDataOrObject,
  ReturnActionResult,
} from '@/lib/actions/types';
import { createUnsupportedReturnCapabilityResult } from './shared';

const RETURN_LABEL_UNSUPPORTED_MESSAGE =
  'Return label download is not backed by a documented REAL customer API.';
const RETURN_TRACKING_UNSUPPORTED_MESSAGE =
  'Return shipment tracking is not backed by a documented REAL customer API.';
const RETURN_ALIAS_UNSUPPORTED_MESSAGE =
  'The /orders/:orderId/return alias flow is not backed by a documented REAL customer API and does not carry the fields required by the REAL returns endpoint.';

export async function uploadReturnLabelAction(
  prevState: ActionState<ReturnActionResult>,
  formData: FormDataOrObject<{ returnId?: string }>,
): Promise<ReturnActionResult> {
  void prevState;
  void formData;

  return createUnsupportedReturnCapabilityResult(RETURN_LABEL_UNSUPPORTED_MESSAGE);
}

export async function trackReturnShipmentAction(
  prevState: ActionState<ReturnActionResult>,
  formData: FormDataOrObject<{ returnId?: string }>,
): Promise<ReturnActionResult> {
  void prevState;
  void formData;

  return createUnsupportedReturnCapabilityResult(RETURN_TRACKING_UNSUPPORTED_MESSAGE);
}

export async function requestReturnOnOrderRouteAction(
  prevState: ActionState<ReturnActionResult>,
  formData: FormDataOrObject<{
    orderId?: string;
    items?: Array<{ productId: string; variantId?: string; quantity: number; reason: string }>;
    message?: string;
  }>,
): Promise<ReturnActionResult> {
  void prevState;
  void formData;

  return createUnsupportedReturnCapabilityResult(RETURN_ALIAS_UNSUPPORTED_MESSAGE);
}
