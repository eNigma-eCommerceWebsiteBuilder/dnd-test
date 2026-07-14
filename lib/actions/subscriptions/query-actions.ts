'use server';

import {
  getBillingHistory as apiGetBillingHistory,
  getMySubscriptions as apiGetMySubscriptions,
  getSubscriptionDetails as apiGetSubscriptionDetails,
  getSubscriptionOrders as apiGetSubscriptionOrders,
  validateDraft as apiValidateDraft,
  type BillingHistoryResponse,
  type DraftValidationResponse,
  type SubscriptionDetailsResponse,
  type SubscriptionOrdersResponse,
  type SubscriptionStatus,
  type SubscriptionsListResponse,
} from '@/lib/api';
import type { ActionResult } from '@/lib/actions/types';
import {
  createErrorResult,
  createSuccessResult,
} from '@/lib/actions/internal/errors';
import { getActionRequestContext } from '@/lib/actions/internal/request';

export async function getMySubscriptionsAction(
  status?: SubscriptionStatus,
  page: number = 1,
  limit: number = 10,
): Promise<ActionResult<SubscriptionsListResponse>> {
  try {
    const subscriptions = await apiGetMySubscriptions(
      status,
      page,
      limit,
      await getActionRequestContext(),
    );

    return createSuccessResult(subscriptions);
  } catch (error: unknown) {
    return createErrorResult(error instanceof Error ? error.message : 'Failed to load subscriptions.');
  }
}

export async function getSubscriptionDetailsAction(
  subscriptionId: string,
): Promise<ActionResult<SubscriptionDetailsResponse>> {
  try {
    const details = await apiGetSubscriptionDetails(
      subscriptionId,
      await getActionRequestContext(),
    );

    return createSuccessResult(details);
  } catch (error: unknown) {
    return createErrorResult(error instanceof Error ? error.message : 'Failed to load subscription.');
  }
}

export async function getSubscriptionOrdersAction(
  subscriptionId: string,
  page: number = 1,
  limit: number = 10,
): Promise<ActionResult<SubscriptionOrdersResponse>> {
  try {
    const orders = await apiGetSubscriptionOrders(
      subscriptionId,
      page,
      limit,
      await getActionRequestContext(),
    );

    return createSuccessResult(orders);
  } catch (error: unknown) {
    return createErrorResult(error instanceof Error ? error.message : 'Failed to load subscription orders.');
  }
}

export async function getBillingHistoryAction(
  subscriptionId: string,
  page: number = 1,
  limit: number = 10,
): Promise<ActionResult<BillingHistoryResponse>> {
  try {
    const billingHistory = await apiGetBillingHistory(
      subscriptionId,
      page,
      limit,
      await getActionRequestContext(),
    );

    return createSuccessResult(billingHistory);
  } catch (error: unknown) {
    return createErrorResult(error instanceof Error ? error.message : 'Failed to load billing history.');
  }
}

export async function validateSubscriptionDraftAction(
  draftId: string,
): Promise<ActionResult<DraftValidationResponse>> {
  try {
    const validation = await apiValidateDraft(
      draftId,
      await getActionRequestContext(),
    );

    return createSuccessResult(validation);
  } catch (error: unknown) {
    return createErrorResult(error instanceof Error ? error.message : 'Failed to validate draft.');
  }
}
