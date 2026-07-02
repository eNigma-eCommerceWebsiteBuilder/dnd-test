import Link from 'next/link';

interface NotEligibleMessageProps {
    orderId: string;
    orderNumber: string;
    message: string;
}

export function NotEligibleMessage({
    orderId,
    orderNumber,
    message,
}: NotEligibleMessageProps) {
    return (
        <section className="@container w-full rounded-card border border-border bg-surface p-6 shadow-card flex flex-col gap-3">
            <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-warning">error</span>
                <h2 className="text-lg font-bold font-heading text-text-base">
                    Return Not Available
                </h2>
            </div>
            <p className="text-sm text-text-muted">
                {message}
            </p>
            <p className="text-xs text-text-muted">
                Order {orderNumber}
            </p>
            <div className="flex flex-wrap gap-3">
                <Link
                    href={`/account/orders/${orderId}`}
                    className="px-4 py-2 rounded-button bg-cta-primary text-on-primary font-semibold hover:bg-cta-primary-hover transition-colors"
                >
                    View Order Details
                </Link>
                <Link
                    href="/account/orders"
                    className="px-4 py-2 rounded-button border border-border text-text-base font-semibold hover:border-border-hover hover:text-primary transition-colors"
                >
                    Back to Orders
                </Link>
            </div>
        </section>
    );
}
