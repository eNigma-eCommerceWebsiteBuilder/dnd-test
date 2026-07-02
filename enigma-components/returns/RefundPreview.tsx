'use client';

import { calculateRefundAmount } from '@/lib/utils/returns';
import { formatPrice } from '@/lib/utils/formatters';
import { RETURNS } from '@/lib/utils/constants';

interface RefundPreviewItem {
    price: number;
    quantity: number;
    tax?: number;
}

interface RefundPreviewProps {
    items: RefundPreviewItem[];
    shippingCost?: number;
    restockingFeePercent?: number;
    includeShipping?: boolean;
}

export function RefundPreview({
    items,
    shippingCost = 0,
    restockingFeePercent = 0,
    includeShipping = true,
}: RefundPreviewProps) {
    const refund = calculateRefundAmount(items, shippingCost, restockingFeePercent, includeShipping);

    return (
        <section className="@container w-full rounded-card border border-border bg-surface p-4 shadow-card flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-text-base">Refund preview</h3>
            <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center justify-between">
                    <span className="text-text-muted">Items</span>
                    <span className="text-text-base font-medium">{formatPrice(refund.breakdown.itemsRefund)}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-text-muted">Shipping</span>
                    <span className="text-text-base font-medium">{formatPrice(refund.breakdown.shippingRefund)}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-text-muted">Restocking fee</span>
                    <span className="text-danger">-{formatPrice(refund.breakdown.restockingFee)}</span>
                </div>
                <div className="pt-2 border-t border-divider flex items-center justify-between">
                    <span className="text-text-base font-semibold">Estimated total</span>
                    <span className="text-lg font-bold text-primary">{formatPrice(refund.total)}</span>
                </div>
            </div>
            <p className="text-xs text-text-muted">
                Refunds are typically processed within {RETURNS.REFUND_PROCESSING_DAYS} business days.
            </p>
        </section>
    );
}
