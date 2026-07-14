'use server';

import {
  addSubscriptionToCart as apiAddSubscriptionToCart,
  createSubscriptionCheckout as apiCreateCheckout,
  type Address,
} from '@/lib/api';
import {
  ACTION_CACHE_TAGS,
  revalidateActionTags,
} from '@/lib/actions/internal/cache';
import {
  createErrorResult,
  createSuccessResult,
  getActionErrorMessage,
} from '@/lib/actions/internal/errors';
import {
  getIntegerField,
  getTrimmedStringField,
  parseJsonField,
} from '@/lib/actions/internal/forms';
import { getActionRequestContext } from '@/lib/actions/internal/request';
import type {
  ActionState,
  FormDataOrObject,
  SubscriptionCheckoutResult,
} from '@/lib/actions/types';

interface SubscriptionCartPayload {
  productId?: string;
  sellingPlanId?: string;
  quantity?: number | string;
  variantId?: string;
}

interface SubscriptionCheckoutPayload {
  customerEmail?: string;
  customerName?: string;
  shippingAddress?: Address | string;
  successUrl?: string;
  cancelUrl?: string;
}

function isAddress(value: unknown): value is Address {
  if (!value || typeof value !== 'object') {
    return false;
  }

  return (
    'street' in value &&
    'city' in value &&
    'state' in value &&
    'zipCode' in value &&
    'country' in value
  );
}

export async function addSubscriptionToCartAction(
  prevState: ActionState<{ checkoutUrl: string; sessionId: string }>,
  formData: FormDataOrObject<SubscriptionCartPayload>,
): Promise<SubscriptionCheckoutResult> {
  void prevState;

  try {
    const productId = getTrimmedStringField(formData, 'productId');
    const sellingPlanId = getTrimmedStringField(formData, 'sellingPlanId');
    const quantity = getIntegerField(formData, 'quantity', 1) ?? 1;
    const variantId = getTrimmedStringField(formData, 'variantId');

    if (!productId) {
      return createErrorResult('Product ID is required');
    }

    if (!sellingPlanId) {
      return createErrorResult('Selling plan ID is required');
    }

    await apiAddSubscriptionToCart(
      productId,
      sellingPlanId,
      quantity,
      variantId,
      await getActionRequestContext(),
    );

    revalidateActionTags([ACTION_CACHE_TAGS.cart]);

    return {
      ...createSuccessResult(undefined, { message: 'Subscription added to cart' }),
      checkoutUrl: undefined,
      sessionId: undefined,
    };
  } catch (error: unknown) {
    return createErrorResult(getActionErrorMessage(error, 'Failed to add subscription to cart'));
  }
}

export async function createSubscriptionCheckoutAction(
  prevState: ActionState<{ checkoutUrl: string; sessionId: string }>,
  formData: FormDataOrObject<SubscriptionCheckoutPayload>,
): Promise<SubscriptionCheckoutResult> {
  void prevState;

  try {
    const customerEmail = getTrimmedStringField(formData, 'customerEmail');
    const customerName = getTrimmedStringField(formData, 'customerName');
    const successUrl = getTrimmedStringField(formData, 'successUrl');
    const cancelUrl = getTrimmedStringField(formData, 'cancelUrl');
    const shippingAddress = parseJsonField(
      formData,
      'shippingAddress',
      isAddress,
      'Invalid shipping address',
    );

    if (!customerEmail) {
      return createErrorResult('Customer email is required');
    }

    if (!customerName) {
      return createErrorResult('Customer name is required');
    }

    if (!shippingAddress) {
      return createErrorResult('Complete shipping address is required');
    }

    if (!successUrl || !cancelUrl) {
      return createErrorResult('Success and cancel URLs are required');
    }

    const response = await apiCreateCheckout(
      {
        customerEmail,
        customerName,
        shippingAddress,
        successUrl,
        cancelUrl,
      },
      await getActionRequestContext(),
    );

    return {
      ...createSuccessResult(response, { message: 'Checkout session created' }),
      checkoutUrl: response.checkoutUrl,
      sessionId: response.sessionId,
    };
  } catch (error: unknown) {
    return createErrorResult(getActionErrorMessage(error, 'Failed to create checkout session'));
  }
}
