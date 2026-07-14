'use client';

import { useSubscriptionActions } from '@/lib/hooks';

type QuickPauseButtonProps = {
  subscriptionId: string;
  onComplete?: () => void;
};

export function QuickPauseButton({
  subscriptionId,
  onComplete,
}: QuickPauseButtonProps) {
  const { pauseSubscription, actionInProgress } = useSubscriptionActions();
  const isBusy = actionInProgress === 'pause';

  const handleClick = async () => {
    try {
      await pauseSubscription(subscriptionId);
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
        {isBusy ? 'Pausing...' : 'Pause'}
      </button>
    </div>
  );
}
