'use server';

import {
  commitDraft as apiCommitDraft,
  discardDraft as apiDiscardDraft,
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
import { SubscriptionFieldKey, getFormString } from './shared';

export async function commitDraftAction(
  prevState: ActionState<SubscriptionDraftResult>,
  formData: FormDataOrObject<{ draftId?: string }>,
): Promise<SubscriptionDraftResult> {
  void prevState;

  const draftId = getFormString(formData, SubscriptionFieldKey.DRAFT_ID);
  if (!draftId) {
    return createErrorResult('Draft ID is required.');
  }

  try {
    const response = await apiCommitDraft(draftId, await getActionRequestContext());
    revalidateActionTags([
      ACTION_CACHE_TAGS.subscriptions,
      ACTION_CACHE_TAGS.subscriptionDrafts,
      subscriptionCacheTag(response.subscription._id),
      draftCacheTag(draftId),
    ]);

    return {
      success: true,
      message: response.message || 'Changes applied successfully.',
    };
  } catch (error: unknown) {
    return createErrorResult(error instanceof Error ? error.message : 'Failed to apply changes.');
  }
}

export async function discardDraftAction(
  prevState: ActionState<SubscriptionDraftResult>,
  formData: FormDataOrObject<{ draftId?: string }>,
): Promise<SubscriptionDraftResult> {
  void prevState;

  const draftId = getFormString(formData, SubscriptionFieldKey.DRAFT_ID);
  if (!draftId) {
    return createErrorResult('Draft ID is required.');
  }

  try {
    const response = await apiDiscardDraft(draftId, await getActionRequestContext());
    revalidateActionTags([ACTION_CACHE_TAGS.subscriptionDrafts, draftCacheTag(draftId)]);

    return {
      success: true,
      message: response.message || 'Draft discarded.',
    };
  } catch (error: unknown) {
    return createErrorResult(error instanceof Error ? error.message : 'Failed to discard draft.');
  }
}
