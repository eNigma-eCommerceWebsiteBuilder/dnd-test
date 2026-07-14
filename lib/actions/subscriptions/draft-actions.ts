'use server';

import {
  createModificationDraft as apiCreateDraft,
  updateDraft as apiUpdateDraft,
  type Address,
} from '@/lib/api';
import type {
  ActionState,
  FormDataOrObject,
  SubscriptionDraftResult,
} from '@/lib/actions/types';
import {
  ACTION_CACHE_TAGS,
  draftCacheTag,
  revalidateActionTags,
  subscriptionCacheTag,
} from '@/lib/actions/internal/cache';
import { createErrorResult } from '@/lib/actions/internal/errors';
import { getActionRequestContext } from '@/lib/actions/internal/request';
import {
  buildAddDraftLinePayload,
  buildDraftResult,
  buildRemoveDraftLinePayload,
  buildUpdateDraftLinePayload,
} from './draft-payloads';
import {
  SubscriptionFieldKey,
  getFormString,
  parseAddress,
  validateAddress,
} from './shared';

export async function createSubscriptionDraftAction(
  prevState: ActionState<SubscriptionDraftResult>,
  formData: FormDataOrObject<{ subscriptionId?: string }>,
): Promise<SubscriptionDraftResult> {
  void prevState;

  const subscriptionId = getFormString(formData, SubscriptionFieldKey.SUBSCRIPTION_ID);
  if (!subscriptionId) {
    return createErrorResult('Subscription ID is required.');
  }

  try {
    const draft = await apiCreateDraft(subscriptionId, await getActionRequestContext());
    revalidateActionTags([
      ACTION_CACHE_TAGS.subscriptionDrafts,
      draftCacheTag(draft._id),
      subscriptionCacheTag(subscriptionId),
    ]);

    return buildDraftResult(draft, 'Draft created successfully.');
  } catch (error: unknown) {
    return createErrorResult(error instanceof Error ? error.message : 'Failed to create draft.');
  }
}

export async function addDraftLineAction(
  prevState: ActionState<SubscriptionDraftResult>,
  formData: FormDataOrObject<{ draftId?: string; productId?: string; variantId?: string; quantity?: number | string }>,
): Promise<SubscriptionDraftResult> {
  void prevState;

  const payload = buildAddDraftLinePayload(formData);
  if (!payload.draftId || !payload.update || payload.fieldErrors) {
    return createErrorResult('Please correct the draft line details.', { fieldErrors: payload.fieldErrors });
  }

  try {
    const draft = await apiUpdateDraft(payload.draftId, payload.update, await getActionRequestContext());
    revalidateActionTags([ACTION_CACHE_TAGS.subscriptionDrafts, draftCacheTag(payload.draftId)]);
    return buildDraftResult(draft, 'Item added to draft.');
  } catch (error: unknown) {
    return createErrorResult(error instanceof Error ? error.message : 'Failed to add item to draft.');
  }
}

export async function updateDraftLineAction(
  prevState: ActionState<SubscriptionDraftResult>,
  formData: FormDataOrObject<{ draftId?: string; lineId?: string; quantity?: number | string }>,
): Promise<SubscriptionDraftResult> {
  void prevState;

  const payload = buildUpdateDraftLinePayload(formData);
  if (!payload.draftId || !payload.update || payload.fieldErrors) {
    return createErrorResult('Please correct the draft line details.', { fieldErrors: payload.fieldErrors });
  }

  try {
    const draft = await apiUpdateDraft(payload.draftId, payload.update, await getActionRequestContext());
    revalidateActionTags([ACTION_CACHE_TAGS.subscriptionDrafts, draftCacheTag(payload.draftId)]);
    return buildDraftResult(draft, 'Quantity updated.');
  } catch (error: unknown) {
    return createErrorResult(error instanceof Error ? error.message : 'Failed to update quantity.');
  }
}

export async function removeDraftLineAction(
  prevState: ActionState<SubscriptionDraftResult>,
  formData: FormDataOrObject<{ draftId?: string; lineId?: string }>,
): Promise<SubscriptionDraftResult> {
  void prevState;

  const payload = buildRemoveDraftLinePayload(formData);
  if (!payload.draftId || !payload.update || payload.fieldErrors) {
    return createErrorResult('Please correct the draft line details.', { fieldErrors: payload.fieldErrors });
  }

  try {
    const draft = await apiUpdateDraft(payload.draftId, payload.update, await getActionRequestContext());
    revalidateActionTags([ACTION_CACHE_TAGS.subscriptionDrafts, draftCacheTag(payload.draftId)]);
    return buildDraftResult(draft, 'Item removed from draft.');
  } catch (error: unknown) {
    return createErrorResult(error instanceof Error ? error.message : 'Failed to remove item.');
  }
}

export async function updateDraftAddressAction(
  prevState: ActionState<SubscriptionDraftResult>,
  formData: FormDataOrObject<{ draftId?: string; address?: Address | string }>,
): Promise<SubscriptionDraftResult> {
  void prevState;

  const draftId = getFormString(formData, SubscriptionFieldKey.DRAFT_ID);
  const address = parseAddress(formData);
  const fieldErrors = validateAddress(address);

  if (!draftId) {
    fieldErrors[SubscriptionFieldKey.DRAFT_ID] = 'Draft ID is required.';
  }
  if (!draftId || !address || Object.keys(fieldErrors).length > 0) {
    return createErrorResult('A complete address is required.', { fieldErrors });
  }

  try {
    const draft = await apiUpdateDraft(
      draftId,
      { shippingAddress: address },
      await getActionRequestContext(),
    );

    revalidateActionTags([ACTION_CACHE_TAGS.subscriptionDrafts, draftCacheTag(draftId)]);
    return buildDraftResult(draft, 'Address updated.');
  } catch (error: unknown) {
    return createErrorResult(error instanceof Error ? error.message : 'Failed to update address.');
  }
}
