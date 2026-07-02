import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import { formatDate } from '@/lib/utils/formatters';
import type { ReturnsListResponse } from '@/lib/api/types/returns';
import { ReturnStatusBadge } from '@/components/returns/ReturnStatusBadge';
import { RefundAmount } from '@/components/returns/RefundAmount';
import { ReturnItems, type ReturnItemSummary } from '@/components/returns/ReturnItems';
import { ViewDetailsButton } from '@/components/returns/ViewDetailsButton';

interface ReturnCardProps {
    returnRequest: ReturnsListResponse['data'][number];
    items?: ReturnItemSummary[];
    detailsHref?: string;
    footer?: ReactNode;
    className?: string;
}

export function ReturnCard({
    returnRequest,
    items = [],
    detailsHref,
    footer,
    className,
}: ReturnCardProps) {
    const createdDate = formatDate(returnRequest.createdAt, { dateStyle: 'medium' });
    const refundAmount = returnRequest.calculations?.totalRefundAmount ?? 0;

    return (
        <article
            className={cn(
                '@container w-full rounded-card bg-surface border border-border shadow-card p-4 @md:p-6 flex flex-col gap-6',
                className
            )}
        >
            <div className="flex flex-col @md:flex-row @md:items-center @md:justify-between gap-3">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 flex-wrap">
                        <ReturnStatusBadge status={returnRequest.status} />
                        <span className="text-xs text-text-muted">•</span>
                        <span className="text-xs text-text-muted">Requested {createdDate}</span>
                    </div>
                    <h3 className="text-base @md:text-lg font-bold text-text-base">
                        Return #{returnRequest.requestNumber}
                    </h3>
                    <p className="text-sm text-text-muted">
                        Order {returnRequest.orderId.orderNumber}
                    </p>
                </div>
                <div className="flex flex-col gap-2 w-full @md:w-auto">
                    <RefundAmount amount={refundAmount} />
                    {detailsHref ? <ViewDetailsButton href={detailsHref} /> : null}
                </div>
            </div>

            {items.length > 0 ? <ReturnItems items={items} /> : null}

            {footer ? <div className="pt-2 border-t border-divider">{footer}</div> : null}
        </article>
    );
}
