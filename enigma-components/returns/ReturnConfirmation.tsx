import Link from 'next/link';

interface ReturnConfirmationProps {
    returnId?: string | null;
}

export function ReturnConfirmation({ returnId }: ReturnConfirmationProps) {
    return (
        <section className="@container w-full rounded-card border border-border bg-surface p-6 shadow-card flex flex-col gap-3">
            <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-success">check_circle</span>
                <h2 className="text-lg font-bold font-heading text-text-base">
                    Return request submitted
                </h2>
            </div>
            <p className="text-sm text-text-muted">
                We have received your return request and will review it shortly.
            </p>
            {returnId ? (
                <p className="text-xs text-text-muted">Return ID: {returnId}</p>
            ) : null}
            <div className="flex flex-wrap gap-3">
                <Link
                    href="/account/returns"
                    className="px-4 py-2 rounded-button bg-cta-primary text-on-primary font-semibold hover:bg-cta-primary-hover transition-colors"
                >
                    View returns
                </Link>
                <Link
                    href="/account/orders"
                    className="px-4 py-2 rounded-button border border-border text-text-base font-semibold hover:border-border-hover hover:text-primary transition-colors"
                >
                    Back to orders
                </Link>
            </div>
        </section>
    );
}
