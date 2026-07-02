import { RETURNS } from '@/lib/utils/constants';

export function ReturnPolicyReminder() {
    return (
        <section className="@container w-full rounded-card border border-border bg-surface p-4 shadow-card flex items-start gap-3">
            <span className="material-symbols-outlined text-primary mt-0.5">info</span>
            <div className="flex flex-col gap-1">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-text-base">
                    Return policy reminder
                </h3>
                <p className="text-sm text-text-muted">
                    Returns must be requested within {RETURNS.WINDOW_DAYS} days of delivery.
                    Items must be in their original condition. Refunds are typically processed
                    within {RETURNS.REFUND_PROCESSING_DAYS} business days after approval.
                </p>
            </div>
        </section>
    );
}
