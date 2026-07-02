import type { Order } from '@/lib/api/types/orders';
import type { ReturnRequest } from '@/lib/api/types/returns';
import { calculateRefundAmount } from '@/lib/utils/returns';
import { formatPrice } from '@/lib/utils/formatters';

interface RefundSummaryProps {
    returnRequest: ReturnRequest;
    order?: Order | null;
}

function getRefundValues(returnRequest: ReturnRequest, order?: Order | null) {
    const returnItems = returnRequest.returnItems;
    const orderItems = order?.items ?? [];

    const itemsForCalculation = returnItems.map((item) => {
        const orderItem = orderItems.find((candidate) => {
            if (candidate.productId !== item.productId) return false;
            if (!item.variantId) return true;
            return candidate.variantId === item.variantId;
        });

        return {
            price: orderItem?.price ?? 0,
            quantity: item.quantity,
        };
    });

    const derived = calculateRefundAmount(
        itemsForCalculation,
        order?.shipping ?? returnRequest.calculations.shippingRefundAmount ?? 0,
        0,
        true
    );

    const itemsRefund = returnRequest.calculations.itemsRefundAmount ?? derived.breakdown.itemsRefund;
    const shippingRefund = returnRequest.calculations.shippingRefundAmount ?? derived.breakdown.shippingRefund;
    const restockingFee = returnRequest.calculations.restockingFee ?? derived.breakdown.restockingFee;
    const total = returnRequest.calculations.totalRefundAmount ?? derived.total;

    return {
        itemsRefund,
        shippingRefund,
        restockingFee,
        total,
    };
}

export function RefundSummary({ returnRequest, order }: RefundSummaryProps) {
    const values = getRefundValues(returnRequest, order);

    return (
        <section className="@container w-full rounded-card border border-border bg-surface p-4 shadow-card flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-text-base">Refund Summary</h3>
            <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center justify-between">
                    <span className="text-text-muted">Items</span>
                    <span className="text-text-base font-medium">{formatPrice(values.itemsRefund)}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-text-muted">Shipping (Refunded)</span>
                    <span className="text-text-base font-medium">{formatPrice(values.shippingRefund)}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-text-muted">Restocking Fee</span>
                    <span className="text-danger">-{formatPrice(values.restockingFee)}</span>
                </div>
                <div className="pt-2 border-t border-divider flex items-center justify-between">
                    <span className="text-text-base font-semibold">Total Refund</span>
                    <span className="text-lg font-bold text-primary">{formatPrice(values.total)}</span>
                </div>
            </div>
        </section>
    );
}
