'use client';

interface SaveButtonProps {
  isLoading: boolean;
}

/**
 * Save Button
 *
 * Per PAGE_AND_COMPONENTS_PLAN.md Section 2.3:
 * - Must include @container on root element.
 */
export function SaveButton({ isLoading }: SaveButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="@container inline-flex items-center justify-center rounded-button px-5 py-2 text-sm font-semibold bg-primary text-on-primary shadow-button hover:bg-primary-dark hover:shadow-button-hover transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-disabled"
    >
      {isLoading ? 'Saving...' : 'Save Address'}
    </button>
  );
}
