import type {
  SubscriptionDraft,
  SubscriptionStatus,
} from '@/lib/api/types/subscriptions';
import { SubscriptionStatusCode } from '@/lib/api/types/subscriptions';
import { assertActionSuccess, getErrorMessage } from '@/lib/hooks/internal/errors';

interface DraftResultLike {
  success: boolean;
  error?: string;
  draft?: SubscriptionDraft;
}

export function getSubscriptionErrorMessage(error: unknown, fallback: string): string {
  return getErrorMessage(error, fallback);
}

export function assertSubscriptionDraft(
  result: DraftResultLike,
  fallback: string,
): SubscriptionDraft {
  assertActionSuccess(result, fallback);

  if (!result.draft) {
    throw new Error(fallback);
  }

  return result.draft;
}

export function canPauseSubscription(status: SubscriptionStatus): boolean {
  return status === SubscriptionStatusCode.ACTIVE;
}

export function canCancelSubscription(status: SubscriptionStatus): boolean {
  return (
    status === SubscriptionStatusCode.ACTIVE ||
    status === SubscriptionStatusCode.PAUSED
  );
}
