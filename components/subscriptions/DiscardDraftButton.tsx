'use client';

type DiscardDraftButtonProps = {
  draftId?: string;
  disabled?: boolean;
  onDiscard: () => void;
};

export function DiscardDraftButton({ draftId, disabled = false, onDiscard }: DiscardDraftButtonProps) {
  return (
    <div className="@container">
      <button
        type="button"
        onClick={onDiscard}
        disabled={disabled || !draftId}
        className="px-4 py-2 rounded-button border border-border text-text-base font-semibold hover:bg-bg-hover transition-colors disabled:opacity-disabled"
      >
        Discard changes
      </button>
    </div>
  );
}
