'use client';

interface IsDefaultCheckboxProps {
  checked: boolean;
  onChange: (value: boolean) => void;
}

/**
 * Is Default Checkbox
 *
 * Per PAGE_AND_COMPONENTS_PLAN.md Section 2.3:
 * - Must include @container on root element.
 */
export function IsDefaultCheckbox({ checked, onChange }: IsDefaultCheckboxProps) {
  return (
    <label className="@container inline-flex items-center gap-3 text-sm text-text-base">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 rounded border border-input-border bg-input-bg text-primary shadow-input transition-colors focus:ring-1 focus:ring-input-border-focus focus:shadow-input-focus"
      />
      Set as default address
    </label>
  );
}
