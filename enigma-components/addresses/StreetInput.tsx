'use client';

interface StreetInputProps {
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

/**
 * Street Input
 *
 * Per PAGE_AND_COMPONENTS_PLAN.md Section 2.3:
 * - Must include @container on root element.
 */
export function StreetInput({ value, error, onChange }: StreetInputProps) {
  return (
    <label className="@container w-full flex flex-col gap-2 text-sm font-medium text-text-base">
      Street Address
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Enter street address"
        className="w-full rounded-input border border-input-border bg-input-bg px-3 py-2 text-sm text-text-base placeholder:text-input-placeholder shadow-input transition-colors focus:border-input-border-focus focus:outline-none focus:ring-1 focus:ring-input-border-focus focus:shadow-input-focus hover:border-input-border-focus"
      />
      {error && <span className="text-xs text-danger">{error}</span>}
    </label>
  );
}
