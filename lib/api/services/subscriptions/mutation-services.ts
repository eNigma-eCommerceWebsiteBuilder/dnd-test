import { apiMutate } from '../../core/client';
import type {
  ApiMutateOptions,
  DraftUpdateRequest,
  DraftValidationResponse,
  PauseSubscriptionRequest,
  SubscriptionDraft,
  SubscriptionResponse,
  UpdatePaymentMethodRequest,
} from '../../types';
import {
  createCancelSubscriptionPayload,
  validateDraftId,
  validateDraftUpdateRequest,
  validateStripePaymentMethodId,
  validateSubscriptionId,
} from './shared';

export async function pauseSubscription(
  id: string,
  reason?: string,
  resumeAt?: string,
  options: ApiMutateOptions = {},
): Promise<SubscriptionResponse> {
  validateSubscriptionId(id);

  const body: PauseSubscriptionRequest = {
    ...(reason ? { reason } : {}),
    ...(resumeAt ? { resumeAt } : {}),
  };

  return apiMutate<SubscriptionResponse>(`/subscriptions/${id}/pause`, {
    method: 'POST',
    body,
    ...options,
  });
}

export async function resumeSubscription(
  id: string,
  options: ApiMutateOptions = {},
): Promise<SubscriptionResponse> {
  validateSubscriptionId(id);

  return apiMutate<SubscriptionResponse>(`/subscriptions/${id}/resume`, {
    method: 'POST',
    ...options,
  });
}

export async function cancelSubscription(
  id: string,
  reason?: string,
  note?: string,
  immediate: boolean = false,
  options: ApiMutateOptions = {},
): Promise<SubscriptionResponse> {
  validateSubscriptionId(id);

  return apiMutate<SubscriptionResponse>(`/subscriptions/${id}/cancel`, {
    method: 'POST',
    body: createCancelSubscriptionPayload(immediate, reason, note),
    ...options,
  });
}

export async function updatePaymentMethod(
  id: string,
  paymentMethodId: string,
  options: ApiMutateOptions = {},
): Promise<SubscriptionResponse> {
  validateSubscriptionId(id);

  const body: UpdatePaymentMethodRequest = {
    paymentMethodId: validateStripePaymentMethodId(paymentMethodId),
  };

  return apiMutate<SubscriptionResponse>(`/subscriptions/${id}/payment-method`, {
    method: 'PUT',
    body,
    ...options,
  });
}

export async function skipNextDelivery(
  id: string,
  options: ApiMutateOptions = {},
): Promise<{ message: string; newBillingDate: string }> {
  validateSubscriptionId(id);

  return apiMutate<{ message: string; newBillingDate: string }>(`/subscriptions/${id}/skip-next`, {
    method: 'POST',
    ...options,
  });
}

export async function createModificationDraft(
  id: string,
  options: ApiMutateOptions = {},
): Promise<SubscriptionDraft> {
  validateSubscriptionId(id);

  return apiMutate<SubscriptionDraft>(`/subscriptions/${id}/draft`, {
    method: 'POST',
    ...options,
  });
}

export async function updateDraft(
  draftId: string,
  changes: DraftUpdateRequest,
  options: ApiMutateOptions = {},
): Promise<SubscriptionDraft> {
  validateDraftId(draftId);
  validateDraftUpdateRequest(changes);

  return apiMutate<SubscriptionDraft>(`/subscriptions/drafts/${draftId}`, {
    method: 'PUT',
    body: changes,
    ...options,
  });
}

export async function validateDraft(
  draftId: string,
  options: ApiMutateOptions = {},
): Promise<DraftValidationResponse> {
  validateDraftId(draftId);

  return apiMutate<DraftValidationResponse>(`/subscriptions/drafts/${draftId}/validate`, {
    method: 'POST',
    ...options,
  });
}

export async function commitDraft(
  draftId: string,
  options: ApiMutateOptions = {},
): Promise<SubscriptionResponse> {
  validateDraftId(draftId);

  return apiMutate<SubscriptionResponse>(`/subscriptions/drafts/${draftId}/commit`, {
    method: 'POST',
    ...options,
  });
}

export async function discardDraft(
  draftId: string,
  options: ApiMutateOptions = {},
): Promise<{ message: string }> {
  validateDraftId(draftId);

  return apiMutate<{ message: string }>(`/subscriptions/drafts/${draftId}`, {
    method: 'DELETE',
    ...options,
  });
}
