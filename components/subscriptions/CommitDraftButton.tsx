'use client';

type CommitDraftButtonProps = {
  draftId?: string;
  disabled?: boolean;
  onCommit: () => void;
};

export function CommitDraftButton({ draftId, disabled = false, onCommit }: CommitDraftButtonProps) {
  return (
    <div className="@container">
      <button
        type="button"
        onClick={onCommit}
        disabled={disabled || !draftId}
        className="px-4 py-2 rounded-button bg-cta-primary text-on-primary font-semibold shadow-button hover:bg-cta-primary-hover hover:shadow-button-hover transition-all disabled:opacity-disabled"
      >
        Apply changes
      </button>
    </div>
  );
}
