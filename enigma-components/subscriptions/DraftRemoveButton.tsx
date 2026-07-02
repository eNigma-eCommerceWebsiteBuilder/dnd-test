'use client';

type DraftRemoveButtonProps = {
  disabled?: boolean;
  onRemove: () => void;
};

export function DraftRemoveButton({ disabled = false, onRemove }: DraftRemoveButtonProps) {
  return (
    <div className="@container">
      <button
        type="button"
        onClick={onRemove}
        disabled={disabled}
        className="px-3 py-1.5 rounded-button border border-danger text-sm font-semibold text-danger hover:bg-danger-subtle transition-colors disabled:opacity-disabled"
      >
        Remove
      </button>
    </div>
  );
}
