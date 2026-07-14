'use server';

import {
  cancelSubscription as apiCancelSubscription,
  pauseSubscription as apiPauseSubscription,
  resumeSubscription as apiResumeSubscription,
} from '@/lib/api';
import type {
  ActionState,
  FormDataOrObject,
  SubscriptionActionResult,
} from '@/lib/actions/types';
import {
  ACTION_CACHE_TAGS,
  revalidateActionTags,
  subscriptionCacheTag,
} from '@/lib/actions/internal/cache';
import { createErrorResult } from '@/lib/actions/internal/errors';
import { getActionRequestContext } from '@/lib/actions/internal/request';
import {
  SubscriptionFieldKey,
  getFormBoolean,
  getFormString,
} from './shared';

function buildSubscriptionResult(
  subscription: NonNullable<SubscriptionActionResult['subscription']>,
  message: string,
): SubscriptionActionResult {
  return {
    success: true,
    data: subscription,
    subscription,
    message,
  };
}

export async function pauseSubscriptionAction(
  prevState: ActionState<SubscriptionActionResult>,
  formData: FormDataOrObject<{ subscriptionId?: string; reason?: string; resumeAt?: string }>,
): Promise<SubscriptionActionResult> {
  void prevState;

  const subscriptionId = getFormString(formData, SubscriptionFieldKey.SUBSCRIPTION_ID);
  if (!subscriptionId) {
    return createErrorResult('Subscription ID is required.');
  }

  try {
    const response = await apiPauseSubscription(
      subscriptionId,
      getFormString(formData, SubscriptionFieldKey.REASON),
      getFormString(formData, SubscriptionFieldKey.RESUME_AT),
      await getActionRequestContext(),
    );

    revalidateActionTags([
      ACTION_CACHE_TAGS.subscriptions,
      subscriptionCacheTag(subscriptionId),
    ]);

    return buildSubscriptionResult(
      response.subscription,
      response.message || 'Subscription paused successfully.',
    );
  } catch (error: unknown) {
    return createErrorResult(error instanceof Error ? error.message : 'Failed to pause subscription.');
  }
}

export async function resumeSubscriptionAction(
  prevState: ActionState<SubscriptionActionResult>,
  formData: FormDataOrObject<{ subscriptionId?: string }>,
): Promise<SubscriptionActionResult> {
  void prevState;

  const subscriptionId = getFormString(formData, SubscriptionFieldKey.SUBSCRIPTION_ID);
  if (!subscriptionId) {
    return createErrorResult('Subscription ID is required.');
  }

  try {
    const response = await apiResumeSubscription(
      subscriptionId,
      await getActionRequestContext(),
    );

    revalidateActionTags([
      ACTION_CACHE_TAGS.subscriptions,
      subscriptionCacheTag(subscriptionId),
    ]);

    return buildSubscriptionResult(
      response.subscription,
      response.message || 'Subscription resumed successfully.',
    );
  } catch (error: unknown) {
    return createErrorResult(error instanceof Error ? error.message : 'Failed to resume subscription.');
  }
}

export async function cancelSubscriptionAction(
  prevState: ActionState<SubscriptionActionResult>,
  formData: FormDataOrObject<{
    subscriptionId?: string;
    reason?: string;
    note?: string;
    immediate?: boolean | string;
  }>,
): Promise<SubscriptionActionResult> {
  void prevState;

  const subscriptionId = getFormString(formData, SubscriptionFieldKey.SUBSCRIPTION_ID);
  if (!subscriptionId) {
    return createErrorResult('Subscription ID is required.');
  }

  try {
    const response = await apiCancelSubscription(
      subscriptionId,
      getFormString(formData, SubscriptionFieldKey.REASON),
      getFormString(formData, SubscriptionFieldKey.NOTE),
      getFormBoolean(formData, SubscriptionFieldKey.IMMEDIATE) ?? false,
      await getActionRequestContext(),
    );

    revalidateActionTags([
      ACTION_CACHE_TAGS.subscriptions,
      subscriptionCacheTag(subscriptionId),
    ]);

    return buildSubscriptionResult(
      response.subscription,
      response.message || 'Subscription updated successfully.',
    );
  } catch (error: unknown) {
    return createErrorResult(error instanceof Error ? error.message : 'Failed to cancel subscription.');
  }
}
