'use server';

import {
  captureCartEmail as apiCaptureCartEmail,
  clearCart as apiClearCart,
  estimateCartTax as apiEstimateCartTax,
  validateEmail,
} from '@/lib/api';
import { createErrorResult, createSuccessResult, getActionErrorMessage } from '@/lib/actions/internal/errors';
import { getTrimmedStringField } from '@/lib/actions/internal/forms';
import { getActionRequestContext } from '@/lib/actions/internal/request';
import type {
  ActionResult,
  ActionState,
  CapturedCartEmailData,
  CartActionResult,
  TaxEstimateResult,
} from '@/lib/actions/types';
import {
  CartFieldKey,
  type CartEmailPayload,
  type CartTaxLocationPayload,
  revalidateCartTags,
  withCartCompatibility,
} from './shared';

export async function clearCartAction(): Promise<CartActionResult> {
  try {
    const cart = await apiClearCart(await getActionRequestContext());
    revalidateCartTags();

    return withCartCompatibility(
      createSuccessResult(cart, { message: 'Cart cleared.' }),
      cart,
    );
  } catch (error: unknown) {
    return createErrorResult(getActionErrorMessage(error, 'Failed to clear cart.'));
  }
}

export async function captureCartEmailAction(
  prevState: ActionState<CapturedCartEmailData>,
  formData: CartEmailPayload,
): Promise<ActionResult<CapturedCartEmailData>> {
  void prevState;

  const email = getTrimmedStringField(formData, CartFieldKey.EMAIL);
  if (!email) {
    return createErrorResult('Email is required.');
  }

  try {
    validateEmail(email);
    const result = await apiCaptureCartEmail(email, await getActionRequestContext());
    revalidateCartTags();

    return createSuccessResult(result, { message: 'Email saved.' });
  } catch (error: unknown) {
    return createErrorResult(getActionErrorMessage(error, 'Failed to save email.'));
  }
}

export async function estimateCartTaxAction(
  prevState: ActionState<TaxEstimateResult>,
  formData: CartTaxLocationPayload,
): Promise<ActionResult<TaxEstimateResult>> {
  void prevState;

  const country = getTrimmedStringField(formData, CartFieldKey.COUNTRY);
  const state = getTrimmedStringField(formData, CartFieldKey.STATE);
  const city = getTrimmedStringField(formData, CartFieldKey.CITY);

  if (!country) {
    return createErrorResult('Country is required.');
  }

  try {
    const result = await apiEstimateCartTax(
      {
        country,
        ...(state ? { state } : {}),
        ...(city ? { city } : {}),
      },
      await getActionRequestContext(),
    );
    revalidateCartTags();

    const taxAmount =
      'totalTax' in result
        ? result.totalTax
        : 'estimatedTax' in result
          ? result.estimatedTax
          : 0;

    return createSuccessResult(result, {
      message: result.taxEnabled ? `Estimated tax: $${taxAmount.toFixed(2)}` : 'No tax applicable',
    });
  } catch (error: unknown) {
    return createErrorResult(getActionErrorMessage(error, 'Failed to estimate tax.'));
  }
}
