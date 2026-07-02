'use client';

import { useState, useTransition } from 'react';
import { deleteAddressAction } from '@/lib/actions/auth-actions';

interface DeleteButtonProps {
  addressId: string;
  onDeleted?: () => void | Promise<void>;
}

/**
 * Delete Button
 *
 * Per PAGE_AND_COMPONENTS_PLAN.md Section 2.3:
 * - Must include @container on root element.
 */
export function DeleteButton({ addressId, onDeleted }: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = () => {
    setError(null);

    startTransition(async () => {
      const result = await deleteAddressAction(addressId);
      if (!result.success) {
        setError(result.error || 'Failed to delete address.');
        return;
      }

      await onDeleted?.();
    });
  };

  return (
    <div className="@container flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className="inline-flex items-center justify-center rounded-button p-2 text-danger border border-danger/20 bg-bg-surface opacity-0 group-hover:opacity-100 transition-all hover:bg-danger-subtle disabled:opacity-disabled"
      >
        <span className="material-symbols-outlined text-lg">
          {isPending ? 'hourglass_top' : 'delete'}
        </span>
        <span className="sr-only">Delete</span>
      </button>
      {error && (
        <span className="text-xs text-danger">
          {error}
        </span>
      )}
    </div>
  );
}
