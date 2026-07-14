'use client';

/**
 * Default Badge
 *
 * Per PAGE_AND_COMPONENTS_PLAN.md Section 2.3:
 * - Must include @container on root element.
 */
export function DefaultBadge() {
  return (
    <span className="@container inline-flex items-center px-3 py-1 rounded-badge text-[10px] font-bold uppercase tracking-[0.2em] bg-badge text-badge-text">
      Default
    </span>
  );
}
