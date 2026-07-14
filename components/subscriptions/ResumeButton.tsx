'use client';

import { useTransition } from 'react';
import { resumeSubscriptionAction } from '@/lib/actions/subscription-actions';

type ResumeButtonProps = {
  subscriptionId: string;
  disabled?: boolean;
};

export function ResumeButton({ subscriptionId, disabled = false }: ResumeButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleResume = () => {
    if (disabled) return;

    startTransition(async () => {
      await resumeSubscriptionAction(null, { subscriptionId });
    });
  };

  return (
    <div className="@container w-full">
      <button
        type="button"
        onClick={handleResume}
        disabled={disabled || isPending}
        className="inline-flex items-center justify-center rounded-button bg-cta-primary px-4 py-2 text-sm font-semibold text-on-primary shadow-button hover:bg-cta-primary-hover hover:shadow-button-hover transition-all disabled:opacity-disabled disabled:cursor-not-allowed"
      >
        {isPending ? 'Resuming...' : 'Resume'}
      </button>
    </div>
  );
}
