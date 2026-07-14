'use server';

import { revalidatePath } from 'next/cache';
import {
  ApiError,
  cancelOrder as apiCancelOrder,
  createOrder as apiCreateOrder,
  updateOrder as apiUpdateOrder,
  type Address,
} from '@/lib/api';
import type {
  ActionResult,
  ActionState,
  FormDataOrObject,
  OrderActionResult,
} from '@/lib/actions/types';
import {
  ACTION_CACHE_TAGS,
  orderCacheTag,
  revalidateActionTags,
} from '@/lib/actions/internal/cache';
import {
  createErrorResult,
  toFieldErrors,
} from '@/lib/actions/internal/errors';
import { getActionRequestContext } from '@/lib/actions/internal/request';
import {
  OrderFieldKey,
  buildCreateOrderPayload,
  buildOrderUpdatePayload,
  getEmailValue,
  getStringValue,
} from './shared';

const ACCOUNT_ORDERS_PATH = '/account/orders';
const CART_PATH = '/cart';

export async function createOrderAction(
  prevState: ActionState<OrderActionResult>,
  formData: FormData,
): Promise<OrderActionResult> {
  void prevState;

  const payload = buildCreateOrderPayload(formData);
  if (!payload.data) {
    return createErrorResult('Please correct the highlighted fields.', {
      fieldErrors: payload.fieldErrors,
    });
  }

  try {
    const response = await apiCreateOrder(payload.data, await getActionRequestContext());
    revalidateActionTags([ACTION_CACHE_TAGS.cart, ACTION_CACHE_TAGS.orders]);
    revalidatePath(CART_PATH);

    return {
      success: true,
      data: response.payment ? response : response.order,
      order: response.order,
      message: 'Order placed successfully.',
      redirectTo: response.payment?.checkoutUrl ?? `/order/${response.order._id}`,
    };
  } catch (error: unknown) {
    return createErrorResult(
      error instanceof Error ? error.message : 'Failed to place order.',
      error instanceof ApiError
        ? { fieldErrors: toFieldErrors(error.validationErrors) }
        : undefined,
    );
  }
}

export async function cancelOrderAction(
  prevState: ActionState,
  formData: FormDataOrObject<{ orderId?: string; email?: string }>,
): Promise<ActionResult> {
  void prevState;

  const orderId = getStringValue(formData, OrderFieldKey.ORDER_ID);
  if (!orderId) {
    return createErrorResult('Order ID is required.');
  }

  try {
    await apiCancelOrder(
      orderId,
      getEmailValue(formData, OrderFieldKey.EMAIL) ?? null,
      await getActionRequestContext(),
    );

    revalidateActionTags([ACTION_CACHE_TAGS.orders, orderCacheTag(orderId)]);
    revalidatePath(ACCOUNT_ORDERS_PATH);

    return {
      success: true,
      message: 'Order cancellation requested successfully.',
    };
  } catch (error: unknown) {
    return createErrorResult(error instanceof Error ? error.message : 'Failed to cancel order.');
  }
}

export async function updateOrderAction(
  prevState: ActionState,
  formData: FormDataOrObject<{
    orderId?: string;
    shippingAddress?: Partial<Address>;
    phone?: string;
  }>,
): Promise<ActionResult> {
  void prevState;

  const orderId = getStringValue(formData, OrderFieldKey.ORDER_ID);
  const updateData = buildOrderUpdatePayload(formData);

  if (!orderId) {
    return createErrorResult('Order ID is required.');
  }
  if (!updateData) {
    return createErrorResult('No updates provided.');
  }

  try {
    await apiUpdateOrder(orderId, updateData, await getActionRequestContext());
    revalidateActionTags([ACTION_CACHE_TAGS.orders, orderCacheTag(orderId)]);

    return {
      success: true,
      message: 'Order updated successfully.',
    };
  } catch (error: unknown) {
    return createErrorResult(error instanceof Error ? error.message : 'Failed to update order.');
  }
}
