'use client';

import { useCallback, useState } from 'react';
import {
  addDraftLineAction,
  createSubscriptionDraftAction,
  removeDraftLineAction,
  updateDraftAddressAction,
  updateDraftLineAction,
} from '@/lib/actions/subscriptions/draft-actions';
import { commitDraftAction, discardDraftAction } from '@/lib/actions/subscriptions/draft-finalize-actions';
import { validateSubscriptionDraftAction } from '@/lib/actions/subscriptions/query-actions';
import type { DraftValidationResponse, SubscriptionDraft } from '@/lib/api/types/subscriptions';
import type { Address } from '@/lib/api/types/orders';
import { getSubscriptionErrorMessage, assertSubscriptionDraft } from './shared';
import type { UseSubscriptionDraftReturn } from './types';

export function useSubscriptionDraft(): UseSubscriptionDraftReturn {
  const [draft, setDraft] = useState<SubscriptionDraft | null>(null);
  const [validationState, setValidationState] = useState<DraftValidationResponse | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runDraftMutation = useCallback(async (
    action: () => Promise<SubscriptionDraft>,
    fallback: string,
  ) => {
    setSaving(true);

    try {
      const nextDraft = await action();
      setDraft(nextDraft);
      return nextDraft;
    } catch (error: unknown) {
      const message = getSubscriptionErrorMessage(error, fallback);
      setError(message);
      throw new Error(message);
    } finally {
      setSaving(false);
    }
  }, []);

  const createDraft = useCallback(async (subscriptionId: string) => {
    setError(null);
    await runDraftMutation(async () => {
      const result = await createSubscriptionDraftAction(null, { subscriptionId });
      return assertSubscriptionDraft(result, 'Failed to create draft');
    }, 'Failed to create draft');
  }, [runDraftMutation]);

  const addLine = useCallback(async (productId: string, variantId?: string, quantity: number = 1) => {
    if (!draft) {
      return;
    }

    await runDraftMutation(async () => {
      const result = await addDraftLineAction(null, { draftId: draft._id, productId, variantId, quantity });
      return assertSubscriptionDraft(result, 'Failed to add line');
    }, 'Failed to add line');
  }, [draft, runDraftMutation]);

  const updateLine = useCallback(async (lineId: string, quantity: number) => {
    if (!draft) {
      return;
    }

    await runDraftMutation(async () => {
      const result = await updateDraftLineAction(null, { draftId: draft._id, lineId, quantity });
      return assertSubscriptionDraft(result, 'Failed to update line');
    }, 'Failed to update line');
  }, [draft, runDraftMutation]);

  const removeLine = useCallback(async (lineId: string) => {
    if (!draft) {
      return;
    }

    await runDraftMutation(async () => {
      const result = await removeDraftLineAction(null, { draftId: draft._id, lineId });
      return assertSubscriptionDraft(result, 'Failed to remove line');
    }, 'Failed to remove line');
  }, [draft, runDraftMutation]);

  const updateAddress = useCallback(async (address: Address) => {
    if (!draft) {
      return;
    }

    await runDraftMutation(async () => {
      const result = await updateDraftAddressAction(null, { draftId: draft._id, address });
      return assertSubscriptionDraft(result, 'Failed to update address');
    }, 'Failed to update address');
  }, [draft, runDraftMutation]);

  const validateDraft = useCallback(async () => {
    if (!draft) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const result = await validateSubscriptionDraftAction(draft._id);
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to validate draft');
      }

      setValidationState(result.data);
    } catch (error: unknown) {
      const message = getSubscriptionErrorMessage(error, 'Failed to validate draft');
      setError(message);
      throw new Error(message);
    } finally {
      setSaving(false);
    }
  }, [draft]);

  const commitDraft = useCallback(async () => {
    if (!draft) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const result = await commitDraftAction(null, { draftId: draft._id });
      if (!result.success) {
        throw new Error(result.error || 'Failed to commit draft');
      }

      setDraft(null);
      setValidationState(null);
    } catch (error: unknown) {
      const message = getSubscriptionErrorMessage(error, 'Failed to commit draft');
      setError(message);
      throw new Error(message);
    } finally {
      setSaving(false);
    }
  }, [draft]);

  const discardDraft = useCallback(async () => {
    if (!draft) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const result = await discardDraftAction(null, { draftId: draft._id });
      if (!result.success) {
        throw new Error(result.error || 'Failed to discard draft');
      }

      setDraft(null);
      setValidationState(null);
    } catch (error: unknown) {
      const message = getSubscriptionErrorMessage(error, 'Failed to discard draft');
      setError(message);
      throw new Error(message);
    } finally {
      setSaving(false);
    }
  }, [draft]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    draft,
    validationState,
    saving,
    error,
    createDraft,
    addLine,
    updateLine,
    removeLine,
    updateAddress,
    validateDraft,
    commitDraft,
    discardDraft,
    clearError,
  };
}
