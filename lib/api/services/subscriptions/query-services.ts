import { apiRequest } from '../../core/client';
import type {
  ApiRequestOptions,
  SubscriptionDetailsResponse,
  SubscriptionDraft,
  SubscriptionOrdersResponse,
  SubscriptionStatus,
  SubscriptionsListResponse,
  BillingHistoryResponse,
  BillingPortalResponse,
} from '../../types';
import {
  validateDraftId,
  validateSubscriptionId,
  validateSubscriptionPagination,
  validateSubscriptionStatus,
} from './shared';

export async function getMySubscriptions(
  status?: SubscriptionStatus,
  page: number = 1,
  limit: number = 10,
  options: ApiRequestOptions = {},
): Promise<SubscriptionsListResponse> {
  validateSubscriptionPagination(page, limit);
  validateSubscriptionStatus(status);

  return apiRequest<SubscriptionsListResponse>('/subscriptions', {
    params: {
      page,
      limit,
      ...(status ? { status } : {}),
    },
    cache: 'no-store',
    ...options,
  });
}

export async function getSubscriptionDetails(
  id: string,
  options: ApiRequestOptions = {},
): Promise<SubscriptionDetailsResponse> {
  validateSubscriptionId(id);

  return apiRequest<SubscriptionDetailsResponse>(`/subscriptions/${id}`, {
    cache: 'no-store',
    ...options,
  });
}

export async function getSubscriptionOrders(
  id: string,
  page: number = 1,
  limit: number = 10,
  options: ApiRequestOptions = {},
): Promise<SubscriptionOrdersResponse> {
  validateSubscriptionId(id);
  validateSubscriptionPagination(page, limit);

  return apiRequest<SubscriptionOrdersResponse>(`/subscriptions/${id}/orders`, {
    params: { page, limit },
    cache: 'no-store',
    ...options,
  });
}

export async function getBillingHistory(
  id: string,
  page: number = 1,
  limit: number = 10,
  options: ApiRequestOptions = {},
): Promise<BillingHistoryResponse> {
  validateSubscriptionId(id);
  validateSubscriptionPagination(page, limit);

  return apiRequest<BillingHistoryResponse>(`/subscriptions/${id}/billing-history`, {
    params: { page, limit },
    cache: 'no-store',
    ...options,
  });
}

export async function getStripeBillingPortal(
  returnUrl?: string,
  options: ApiRequestOptions = {},
): Promise<BillingPortalResponse> {
  return apiRequest<BillingPortalResponse>('/subscriptions/billing-portal', {
    params: returnUrl ? { returnUrl } : undefined,
    cache: 'no-store',
    ...options,
  });
}

export async function getDraft(
  draftId: string,
  options: ApiRequestOptions = {},
): Promise<SubscriptionDraft> {
  validateDraftId(draftId);

  return apiRequest<SubscriptionDraft>(`/subscriptions/drafts/${draftId}`, {
    cache: 'no-store',
    ...options,
  });
}
