import Link from 'next/link';
import { formatDate } from '@/lib/utils/formatters';

interface ReturnWindowExpiredProps {
    orderNumber: string;
    deadline: Date;
}

export function ReturnWindowExpired({ orderNumber, deadline }: ReturnWindowExpiredProps) {
    return (
        <section className="@container w-full rounded-card border border-border bg-surface p-6 shadow-card flex flex-col gap-3">
            <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-danger">schedule</span>
                <h2 className="text-lg font-bold font-heading text-text-base">
                    Return Window Expired
                </h2>
            </div>
            <p className="text-sm text-text-muted">
                The return window for order {orderNumber} ended on {formatDate(deadline)}.
            </p>
            <Link
                href="/account/orders"
                className="px-4 py-2 w-fit rounded-button bg-cta-secondary text-text-base font-semibold hover:bg-cta-secondary-hover transition-colors"
            >
                Back to Orders
            </Link>
        </section>
    );
}
