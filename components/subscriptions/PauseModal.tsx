'use client';

import { useState, useTransition } from 'react';
import { cn } from '@/lib/utils/cn';
import { pauseSubscriptionAction } from '@/lib/actions/subscription-actions';

type PauseModalProps = {
  isOpen: boolean;
  subscriptionId: string;
  onClose: () => void;
  onSuccess?: () => void;
  className?: string;
};

export function PauseModal({ isOpen, subscriptionId, onClose, onSuccess, className }: PauseModalProps) {
  const [reason, setReason] = useState('');
  const [resumeAt, setResumeAt] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!isOpen) return null;

  return (
    <div className="@container fixed inset-0 z-modal flex items-center justify-center px-4">
      <button
        type="button"
        className="absolute inset-0 bg-bg-overlay opacity-overlay backdrop-blur-modal"
        onClick={onClose}
        aria-label="Close pause subscription modal"
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative w-full max-w-md rounded-modal border border-border bg-bg-surface p-6 shadow-modal',
          className
        )}
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning-subtle">
            <span className="material-symbols-outlined text-warning">pause</span>
          </div>
          <div>
            <h3 className="text-base font-semibold text-text-base">Pause subscription</h3>
            <p className="text-sm text-text-muted">You can resume anytime.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-base" htmlFor="pause-reason">
              Reason (optional)
            </label>
            <input
              id="pause-reason"
              type="text"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className="w-full rounded-input border border-input-border bg-input-bg px-3 py-2 text-sm text-text-base placeholder:text-input-placeholder focus:border-input-border-focus focus:outline-none"
              placeholder="Vacation, budget, etc."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-base" htmlFor="pause-resume">
              Resume date (optional)
            </label>
            <input
              id="pause-resume"
              type="date"
              value={resumeAt}
              onChange={(event) => setResumeAt(event.target.value)}
              className="w-full rounded-input border border-input-border bg-input-bg px-3 py-2 text-sm text-text-base placeholder:text-input-placeholder focus:border-input-border-focus focus:outline-none"
            />
          </div>
        </div>

        {error ? (
          <p className="mt-4 text-sm text-danger" role="status" aria-live="polite">
            {error}
          </p>
        ) : null}

        <div className="mt-6 flex flex-col gap-3 @sm:flex-row @sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-button bg-bg-sunken px-4 py-2 font-semibold text-text-base transition-colors hover:bg-bg-hover"
            disabled={isPending}
          >
            Keep active
          </button>
          <button
            type="button"
            onClick={() =>
              startTransition(async () => {
                setError(null);
                const result = await pauseSubscriptionAction(null, {
                  subscriptionId,
                  reason: reason || undefined,
                  resumeAt: resumeAt || undefined,
                });
                if (!result.success) {
                  setError(result.error || 'Failed to pause subscription');
                  return;
                }

                onSuccess?.();
                onClose();
                setReason('');
                setResumeAt('');
              })
            }
            className="rounded-button bg-warning px-4 py-2 font-semibold text-on-warning transition-colors hover:bg-warning-dark disabled:opacity-disabled"
            disabled={isPending}
          >
            {isPending ? 'Pausing...' : 'Pause subscription'}
          </button>
        </div>
      </div>
    </div>
  );
}
