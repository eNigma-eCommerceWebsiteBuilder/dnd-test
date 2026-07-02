'use client';

import { useState, useTransition } from 'react';
import { cn } from '@/lib/utils/cn';
import { skipNextDeliveryAction } from '@/lib/actions/subscription-actions';

type SkipConfirmModalProps = {
  isOpen: boolean;
  subscriptionId: string;
  onClose: () => void;
  onSuccess?: () => void;
  className?: string;
};

export function SkipConfirmModal({
  isOpen,
  subscriptionId,
  onClose,
  onSuccess,
  className,
}: SkipConfirmModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!isOpen) return null;

  return (
    <div className="@container fixed inset-0 z-modal flex items-center justify-center px-4">
      <button
        type="button"
        className="absolute inset-0 bg-bg-overlay opacity-overlay backdrop-blur-modal"
        onClick={onClose}
        aria-label="Close skip delivery modal"
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
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-info-subtle">
            <span className="material-symbols-outlined text-info">local_shipping</span>
          </div>
          <div>
            <h3 className="text-base font-semibold text-text-base">Skip next delivery?</h3>
            <p className="text-sm text-text-muted">Your next cycle will be pushed forward.</p>
          </div>
        </div>

        {error ? (
          <p className="mb-3 text-sm text-danger" role="status" aria-live="polite">
            {error}
          </p>
        ) : null}

        <div className="flex flex-col gap-3 @sm:flex-row @sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-button bg-bg-sunken px-4 py-2 font-semibold text-text-base transition-colors hover:bg-bg-hover"
            disabled={isPending}
          >
            Keep schedule
          </button>
          <button
            type="button"
            onClick={() =>
              startTransition(async () => {
                setError(null);
                const result = await skipNextDeliveryAction(null, { subscriptionId });
                if (!result.success) {
                  setError(result.error || 'Failed to skip delivery');
                  return;
                }
                onSuccess?.();
                onClose();
              })
            }
            className="rounded-button bg-info px-4 py-2 font-semibold text-on-info transition-colors hover:bg-info-dark disabled:opacity-disabled"
            disabled={isPending}
          >
            {isPending ? 'Skipping...' : 'Skip delivery'}
          </button>
        </div>
      </div>
    </div>
  );
}
