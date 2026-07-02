'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import type { Address } from '@/lib/api/types/orders';
import type { SubscriptionContract, SubscriptionDraft, SubscriptionLine } from '@/lib/api/types/subscriptions';
import {
  createSubscriptionDraftAction,
  updateDraftLineAction,
  removeDraftLineAction,
  updateDraftAddressAction,
  commitDraftAction,
  discardDraftAction,
} from '@/lib/actions/subscription-actions';
import { DraftAddItemModal } from '@/components/subscriptions/DraftAddItemModal';
import { DraftAddressEditor } from '@/components/subscriptions/DraftAddressEditor';
import { DraftItemsSection } from '@/components/subscriptions/DraftItemsSection';
import { DraftValidationErrors } from '@/components/subscriptions/DraftValidationErrors';
import { FinancialImpactCard } from '@/components/subscriptions/FinancialImpactCard';
import { CommitDraftButton } from '@/components/subscriptions/CommitDraftButton';
import { DiscardDraftButton } from '@/components/subscriptions/DiscardDraftButton';

const defaultAddress: Address = { street: '', city: '', state: '', zipCode: '', country: '' };

type DraftEditorProps = {
  subscription: SubscriptionContract;
  onClose: () => void;
};

export function DraftEditor({ subscription, onClose }: DraftEditorProps) {
  const [draft, setDraft] = useState<SubscriptionDraft | null>(null);
  const [lines, setLines] = useState<SubscriptionLine[]>(subscription.lines);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    startTransition(async () => {
      const result = await createSubscriptionDraftAction(null, { subscriptionId: subscription._id });
      if (!isMounted) return;
      if (!result.success || !result.draft) {
        setError(result.error || 'Failed to start draft');
        return;
      }
      setDraft(result.draft as SubscriptionDraft);
    });

    return () => {
      isMounted = false;
    };
  }, [subscription._id]);

  const draftId = draft?._id;

  const address = useMemo(() => {
    if (draft?.changes?.shippingAddress) {
      return draft.changes.shippingAddress;
    }
    return subscription.shippingAddress || defaultAddress;
  }, [draft?.changes?.shippingAddress, subscription.shippingAddress]);

  const handleUpdateLine = (lineId: string, quantity: number) => {
    if (!draftId) return;
    startTransition(async () => {
      const result = await updateDraftLineAction(null, { draftId, lineId, quantity });
      if (!result.success) {
        setError(result.error || 'Failed to update quantity');
        return;
      }
      setDraft(result.draft as SubscriptionDraft);
      setLines((prev) => prev.map((line) => (line._id === lineId ? { ...line, quantity } : line)));
    });
  };

  const handleRemoveLine = (lineId: string) => {
    if (!draftId) return;
    startTransition(async () => {
      const result = await removeDraftLineAction(null, { draftId, lineId });
      if (!result.success) {
        setError(result.error || 'Failed to remove item');
        return;
      }
      setDraft(result.draft as SubscriptionDraft);
      setLines((prev) => prev.filter((line) => line._id !== lineId));
    });
  };

  const handleAddressUpdate = (nextAddress: Address) => {
    if (!draftId) return;
    startTransition(async () => {
      const result = await updateDraftAddressAction(null, {
        draftId,
        address: nextAddress,
      });
      if (!result.success) {
        setError(result.error || 'Failed to update address');
        return;
      }
      setDraft(result.draft as SubscriptionDraft);
    });
  };

  const handleCommit = () => {
    if (!draftId) return;
    startTransition(async () => {
      const result = await commitDraftAction(null, { draftId });
      if (!result.success) {
        setError(result.error || 'Failed to apply changes');
        return;
      }
      onClose();
    });
  };

  const handleDiscard = () => {
    if (!draftId) return;
    startTransition(async () => {
      const result = await discardDraftAction(null, { draftId });
      if (!result.success) {
        setError(result.error || 'Failed to discard draft');
        return;
      }
      onClose();
    });
  };

  return (
    <section className="@container mt-6 rounded-card border border-border bg-bg-surface p-6 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="text-lg font-semibold text-text-base">Draft changes</h3>
          <p className="text-sm text-text-muted">Adjust upcoming deliveries before applying.</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-sm font-semibold text-text-muted hover:text-text-base transition-colors"
        >
          Close
        </button>
      </div>

      {error ? <p className="mb-4 text-sm text-danger">{error}</p> : null}

      <div className="space-y-6">
        <DraftItemsSection
          draftId={draftId}
          isPending={isPending}
          lines={lines}
          onAddItem={() => setIsAddOpen(true)}
          onRemoveLine={handleRemoveLine}
          onUpdateLine={handleUpdateLine}
        />

        <DraftAddressEditor
          address={address}
          onSave={handleAddressUpdate}
          disabled={!draftId || isPending}
        />

        <DraftValidationErrors
          errors={draft?.validationErrors || []}
          stockIssues={draft?.stockIssues || []}
        />

        {draft?.financialImpact ? (
          <FinancialImpactCard impact={draft.financialImpact} />
        ) : null}

        <div className="flex flex-wrap gap-3 justify-end">
          <DiscardDraftButton
            draftId={draftId}
            disabled={!draftId || isPending}
            onDiscard={handleDiscard}
          />
          <CommitDraftButton
            draftId={draftId}
            disabled={!draftId || isPending}
            onCommit={handleCommit}
          />
        </div>
      </div>

      <DraftAddItemModal
        isOpen={isAddOpen}
        draftId={draftId}
        onClose={() => setIsAddOpen(false)}
        onDraftUpdated={(nextDraft) => setDraft(nextDraft)}
      />
    </section>
  );
}
