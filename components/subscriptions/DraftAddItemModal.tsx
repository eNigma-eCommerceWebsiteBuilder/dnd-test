'use client';

import { useState, useTransition } from 'react';
import type { SubscriptionDraft } from '@/lib/api/types/subscriptions';
import { cn } from '@/lib/utils/cn';
import { addDraftLineAction } from '@/lib/actions/subscription-actions';

type DraftAddItemModalProps = {
  isOpen: boolean;
  draftId?: string;
  onClose: () => void;
  onDraftUpdated: (draft: SubscriptionDraft) => void;
  className?: string;
};

export function DraftAddItemModal({
  isOpen,
  draftId,
  onClose,
  onDraftUpdated,
  className,
}: DraftAddItemModalProps) {
  const [productId, setProductId] = useState('');
  const [variantId, setVariantId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!draftId) return;
    setError(null);

    startTransition(async () => {
      const result = await addDraftLineAction(null, {
        draftId,
        productId: productId.trim(),
        variantId: variantId.trim() || undefined,
        quantity,
      });

      if (!result.success || !result.draft) {
        setError(result.error || 'Failed to add item');
        return;
      }

      onDraftUpdated(result.draft as SubscriptionDraft);
      setProductId('');
      setVariantId('');
      setQuantity(1);
      onClose();
    });
  };

  return (
    <div className="@container fixed inset-0 z-modal flex items-center justify-center px-4">
      <button
        type="button"
        className="absolute inset-0 bg-bg-overlay opacity-overlay backdrop-blur-modal"
        onClick={onClose}
        aria-label="Close add item modal"
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
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-bg-sunken">
            <span className="material-symbols-outlined text-text-muted">add</span>
          </div>
          <div>
            <h3 className="text-base font-semibold text-text-base">Add item</h3>
            <p className="text-sm text-text-muted">Add a product by ID.</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-sm font-medium text-text-base" htmlFor="draft-product-id">
              Product ID
            </label>
            <input
              id="draft-product-id"
              type="text"
              value={productId}
              onChange={(event) => setProductId(event.target.value)}
              className="w-full rounded-input border border-input-border bg-input-bg px-3 py-2 text-sm text-text-base"
              placeholder="Enter product ID"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-text-base" htmlFor="draft-variant-id">
              Variant ID (optional)
            </label>
            <input
              id="draft-variant-id"
              type="text"
              value={variantId}
              onChange={(event) => setVariantId(event.target.value)}
              className="w-full rounded-input border border-input-border bg-input-bg px-3 py-2 text-sm text-text-base"
              placeholder="Enter variant ID"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-text-base" htmlFor="draft-quantity">
              Quantity
            </label>
            <input
              id="draft-quantity"
              type="number"
              min={1}
              value={quantity}
              onChange={(event) => setQuantity(parseInt(event.target.value || '1', 10))}
              className="w-full rounded-input border border-input-border bg-input-bg px-3 py-2 text-sm text-text-base"
            />
          </div>
        </div>

        {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}

        <div className="mt-6 flex flex-col gap-3 @sm:flex-row @sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-button bg-bg-sunken px-4 py-2 font-semibold text-text-base transition-colors hover:bg-bg-hover"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending || !draftId}
            className="rounded-button bg-cta-primary px-4 py-2 font-semibold text-on-primary transition-colors hover:bg-cta-primary-hover disabled:opacity-disabled"
          >
            {isPending ? 'Adding...' : 'Add item'}
          </button>
        </div>
      </div>
    </div>
  );
}
