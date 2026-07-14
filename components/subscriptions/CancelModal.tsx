'use client';

import { useState, useTransition } from 'react';
import { cn } from '@/lib/utils/cn';
import { cancelSubscriptionAction } from '@/lib/actions/subscription-actions';

type CancelModalProps = {
  isOpen: boolean;
  subscriptionId: string;
  onClose: () => void;
  onSuccess?: () => void;
  className?: string;
};

export function CancelModal({
  isOpen,
  subscriptionId,
  onClose,
  onSuccess,
  className,
}: CancelModalProps) {
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');
  const [immediate, setImmediate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!isOpen) return null;

  return (
    <div className="@container fixed inset-0 z-modal flex items-center justify-center px-4">
      <button
        type="button"
        className="absolute inset-0 bg-bg-overlay opacity-overlay backdrop-blur-modal"
        onClick={onClose}
        aria-label="Close cancel subscription modal"
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
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-danger-subtle">
            <span className="material-symbols-outlined text-danger">cancel</span>
          </div>
          <div>
            <h3 className="text-base font-semibold text-text-base">Cancel subscription</h3>
            <p className="text-sm text-text-muted">You can cancel now or at period end.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-base" htmlFor="cancel-reason">
              Reason (optional)
            </label>
            <input
              id="cancel-reason"
              type="text"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className="w-full rounded-input border border-input-border bg-input-bg px-3 py-2 text-sm text-text-base placeholder:text-input-placeholder focus:border-input-border-focus focus:outline-none"
              placeholder="Switching plans, etc."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-base" htmlFor="cancel-note">
              Note (optional)
            </label>
            <textarea
              id="cancel-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              className="min-h-[90px] w-full rounded-input border border-input-border bg-input-bg px-3 py-2 text-sm text-text-base placeholder:text-input-placeholder focus:border-input-border-focus focus:outline-none"
              placeholder="Add any additional context"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-text-base">
            <input
              type="checkbox"
              checked={immediate}
              onChange={(event) => setImmediate(event.target.checked)}
              className="h-4 w-4 rounded border border-input-border text-primary focus:ring-2 focus:ring-primary"
            />
            Cancel immediately
          </label>
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
            Keep subscription
          </button>
          <button
            type="button"
            onClick={() =>
              startTransition(async () => {
                setError(null);
                const result = await cancelSubscriptionAction(null, {
                  subscriptionId,
                  reason: reason || undefined,
                  note: note || undefined,
                  immediate,
                });
                if (!result.success) {
                  setError(result.error || 'Failed to cancel subscription');
                  return;
                }

                onSuccess?.();
                onClose();
                setReason('');
                setNote('');
                setImmediate(false);
              })
            }
            className="rounded-button bg-danger px-4 py-2 font-semibold text-on-danger transition-colors hover:bg-danger-dark disabled:opacity-disabled"
            disabled={isPending}
          >
            {isPending ? 'Cancelling...' : 'Cancel subscription'}
          </button>
        </div>
      </div>
    </div>
  );
}
