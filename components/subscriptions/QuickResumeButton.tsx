'use client';

import { useSubscriptionActions } from '@/lib/hooks';

type QuickResumeButtonProps = {
  subscriptionId: string;
  onComplete?: () => void;
};

export function QuickResumeButton({
  subscriptionId,
  onComplete,
}: QuickResumeButtonProps) {
  const { resumeSubscription, actionInProgress } = useSubscriptionActions();
  const isBusy = actionInProgress === 'resume';

  const handleClick = async () => {
    try {
      await resumeSubscription(subscriptionId);
      onComplete?.();
    } catch {
      return;
    }
  };

  return (
    <div className="@container">
      <button
        type="button"
        onClick={handleClick}
        disabled={isBusy}
        className="inline-flex items-center justify-center rounded-button border border-border px-4 py-2 text-sm font-semibold text-text-base transition-colors hover:bg-bg-hover disabled:opacity-disabled disabled:cursor-not-allowed"
      >
        {isBusy ? 'Resuming...' : 'Resume'}
      </button>
    </div>
  );
}
