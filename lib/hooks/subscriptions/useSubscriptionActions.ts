'use client';

import { useCallback, useState } from 'react';
import {
  cancelSubscriptionAction,
  pauseSubscriptionAction,
  resumeSubscriptionAction,
} from '@/lib/actions/subscriptions/lifecycle-actions';
import type { SubscriptionContract } from '@/lib/api/types/subscriptions';
import { assertActionSuccess } from '@/lib/hooks/internal/errors';
import {
  canCancelSubscription,
  canPauseSubscription,
  getSubscriptionErrorMessage,
} from './shared';
import {
  SubscriptionLifecycleActionCode,
  type UseSubscriptionActionsReturn,
} from './types';

export function useSubscriptionActions(): UseSubscriptionActionsReturn {
  const [actionInProgress, setActionInProgress] = useState<SubscriptionLifecycleActionCode | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pauseSubscription = useCallback(async (subscriptionId: string, reason?: string, resumeAt?: string) => {
    setActionInProgress(SubscriptionLifecycleActionCode.PAUSE);
    setError(null);

    try {
      const result = await pauseSubscriptionAction(null, { subscriptionId, reason, resumeAt });
      assertActionSuccess(result, 'Failed to pause subscription');
    } catch (error: unknown) {
      const message = getSubscriptionErrorMessage(error, 'Failed to pause subscription');
      setError(message);
      throw new Error(message);
    } finally {
      setActionInProgress(null);
    }
  }, []);

  const resumeSubscription = useCallback(async (subscriptionId: string) => {
    setActionInProgress(SubscriptionLifecycleActionCode.RESUME);
    setError(null);

    try {
      const result = await resumeSubscriptionAction(null, { subscriptionId });
      assertActionSuccess(result, 'Failed to resume subscription');
    } catch (error: unknown) {
      const message = getSubscriptionErrorMessage(error, 'Failed to resume subscription');
      setError(message);
      throw new Error(message);
    } finally {
      setActionInProgress(null);
    }
  }, []);

  const cancelSubscription = useCallback(async (
    subscriptionId: string,
    reason?: string,
    note?: string,
    immediate: boolean = false,
  ) => {
    setActionInProgress(SubscriptionLifecycleActionCode.CANCEL);
    setError(null);

    try {
      const result = await cancelSubscriptionAction(null, {
        subscriptionId,
        reason,
        note,
        immediate,
      });
      assertActionSuccess(result, 'Failed to cancel subscription');
    } catch (error: unknown) {
      const message = getSubscriptionErrorMessage(error, 'Failed to cancel subscription');
      setError(message);
      throw new Error(message);
    } finally {
      setActionInProgress(null);
    }
  }, []);

  const canPause = useCallback((subscription: SubscriptionContract) => {
    return canPauseSubscription(subscription.status);
  }, []);

  const canCancel = useCallback((subscription: SubscriptionContract) => {
    return canCancelSubscription(subscription.status);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    actionInProgress,
    error,
    pauseSubscription,
    resumeSubscription,
    cancelSubscription,
    canPause,
    canCancel,
    clearError,
  };
}
