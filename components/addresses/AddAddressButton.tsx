'use client';

interface AddAddressButtonProps {
  onClick: () => void;
}

/**
 * Add Address Button
 *
 * Per PAGE_AND_COMPONENTS_PLAN.md Section 2.3:
 * - Must include @container on root element.
 */
export function AddAddressButton({ onClick }: AddAddressButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="@container inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-button font-semibold text-sm shadow-button hover:bg-primary-dark hover:shadow-button-hover transition-all hover:-translate-y-0.5 active:translate-y-0"
    >
      <span className="material-symbols-outlined text-[20px]">add</span>
      Add New Address
    </button>
  );
}
