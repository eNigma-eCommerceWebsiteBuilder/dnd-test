import type { Order } from '@/lib/api/types/orders';
import type { ReturnItem } from '@/lib/api/types/returns';
import { ReturnItemCard } from '@/components/returns/ReturnItemCard';
import { cn } from '@/lib/utils/cn';

interface ReturnItemListProps {
    returnItems: ReturnItem[];
    order?: Order | null;
    className?: string;
}

export function ReturnItemList({ returnItems, order, className }: ReturnItemListProps) {
    const orderItems = order?.items ?? [];

    return (
        <section className={cn("@container flex w-full flex-col gap-4", className)}>
            <div className="flex items-center gap-2">
                <h2 className="text-lg font-heading font-bold text-text-base @md:text-xl">Returned Items</h2>
                <span className="text-sm text-text-muted">({returnItems.length})</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {returnItems.map((item) => {
                    const orderItem = orderItems.find((orderItemCandidate) => {
                        if (orderItemCandidate.productId !== item.productId) return false;
                        if (!item.variantId) return true;
                        return orderItemCandidate.variantId === item.variantId;
                    });

                    return (
                        <ReturnItemCard
                            key={`${item.productId}-${item.variantId ?? 'base'}`}
                            returnItem={item}
                            orderItem={orderItem}
                        />
                    );
                })}
            </div>
        </section>
    );
}
