import type { SubscriptionLine } from '@/lib/api/types/subscriptions';
import { DraftLineItem } from '@/components/subscriptions/DraftLineItem';

interface DraftItemsSectionProps {
  draftId?: string;
  isPending: boolean;
  lines: SubscriptionLine[];
  onAddItem: () => void;
  onRemoveLine: (lineId: string) => void;
  onUpdateLine: (lineId: string, quantity: number) => void;
}

export function DraftItemsSection({
  draftId,
  isPending,
  lines,
  onAddItem,
  onRemoveLine,
  onUpdateLine,
}: DraftItemsSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-text-base">Items</h4>
        <button
          type="button"
          onClick={onAddItem}
          disabled={!draftId || isPending}
          className="text-sm font-semibold text-primary hover:underline disabled:opacity-disabled disabled:cursor-not-allowed"
        >
          Add item
        </button>
      </div>
      {!draftId ? (
        <p className="text-xs text-text-muted">Preparing draft...</p>
      ) : null}
      <div className="space-y-3">
        {lines.length > 0 ? (
          lines.map((line) => (
            <DraftLineItem
              key={line._id}
              line={line}
              draftId={draftId}
              onUpdateQuantity={onUpdateLine}
              onRemove={onRemoveLine}
            />
          ))
        ) : (
          <p className="text-sm text-text-muted">No items in this subscription.</p>
        )}
      </div>
    </div>
  );
}
