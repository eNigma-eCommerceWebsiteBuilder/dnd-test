'use client';

import { useState } from 'react';

type DraftQuantityInputProps = {
  quantity: number;
  disabled?: boolean;
  onUpdate: (quantity: number) => void;
};

export function DraftQuantityInput({ quantity, disabled = false, onUpdate }: DraftQuantityInputProps) {
  const [value, setValue] = useState(quantity);

  return (
    <div className="@container flex items-center gap-2">
      <input
        type="number"
        min={1}
        value={value}
        onChange={(event) => setValue(parseInt(event.target.value || '1', 10))}
        className="w-20 rounded-input border border-input-border bg-input-bg px-2 py-1 text-sm text-text-base"
        disabled={disabled}
      />
      <button
        type="button"
        onClick={() => onUpdate(value)}
        disabled={disabled}
        className="px-3 py-1.5 rounded-button border border-border text-sm font-semibold text-text-base hover:bg-bg-hover transition-colors disabled:opacity-disabled"
      >
        Update
      </button>
    </div>
  );
}
