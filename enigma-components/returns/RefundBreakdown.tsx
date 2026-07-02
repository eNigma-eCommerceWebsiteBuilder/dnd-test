import type { Order } from '@/lib/api/types/orders';
import type { ReturnRequest } from '@/lib/api/types/returns';
import { calculateRefundAmount } from '@/lib/utils/returns';
import { formatPrice } from '@/lib/utils/formatters';

interface RefundPreviewItem {
    price: number;
    quantity: number;
    tax?: number;
}

interface RefundBreakdownProps {
    returnRequest?: ReturnRequest;
    order?: Order | null;
    items?: RefundPreviewItem[];
    shippingCost?: number;
    restockingFeePercent?: number;
    includeShipping?: boolean;
}

function getRefundBreakdown({
    returnRequest,
    order,
    items,
    shippingCost = 0,
    restockingFeePercent = 0,
    includeShipping = true,
}: RefundBreakdownProps) {
    if (returnRequest) {
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

        return {
            itemsRefund: returnRequest.calculations.itemsRefundAmount ?? derived.breakdown.itemsRefund,
            shippingRefund: returnRequest.calculations.shippingRefundAmount ?? derived.breakdown.shippingRefund,
            restockingFee: returnRequest.calculations.restockingFee ?? derived.breakdown.restockingFee,
            taxRefund: derived.tax,
        };
    }

    const derived = calculateRefundAmount(
        items ?? [],
        shippingCost,
        restockingFeePercent,
        includeShipping
    );

    return {
        itemsRefund: derived.breakdown.itemsRefund,
        shippingRefund: derived.breakdown.shippingRefund,
        restockingFee: derived.breakdown.restockingFee,
        taxRefund: derived.tax,
    };
}

export function RefundBreakdown({
    returnRequest,
    order,
    items,
    shippingCost,
    restockingFeePercent,
    includeShipping,
}: RefundBreakdownProps) {
    const breakdown = getRefundBreakdown({
        returnRequest,
        order,
        items,
        shippingCost,
        restockingFeePercent,
        includeShipping,
    });

    return (
        <section className="@container w-full rounded-card border border-border bg-surface p-4 shadow-card flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-text-base">Refund Breakdown</h3>
            <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center justify-between">
                    <span className="text-text-muted">Items Refund</span>
                    <span className="text-text-base font-medium">{formatPrice(breakdown.itemsRefund)}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-text-muted">Shipping Refund</span>
                    <span className="text-text-base font-medium">{formatPrice(breakdown.shippingRefund)}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-text-muted">Restocking Fee</span>
                    <span className="text-danger">-{formatPrice(breakdown.restockingFee)}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-text-muted">Tax Refund</span>
                    <span className="text-text-base font-medium">{formatPrice(breakdown.taxRefund)}</span>
                </div>
            </div>
        </section>
    );
}
