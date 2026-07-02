'use client';

import type { OrderItem } from '@/lib/api/types/orders';
import { ReturnItemRow } from '@/components/returns/ReturnItemRow';

export interface SelectedReturnItem {
    key: string;
    orderItemId?: string;
    productId: string;
    variantId?: string;
    quantity: number;
}

interface OrderItemSelectorProps {
    items: OrderItem[];
    selectedItems: Record<string, SelectedReturnItem>;
    onSelectItem: (itemKey: string, selected: boolean) => void;
    onQuantityChange: (itemKey: string, nextQuantity: number) => void;
}

export function OrderItemSelector({
    items,
    selectedItems,
    onSelectItem,
    onQuantityChange,
}: OrderItemSelectorProps) {
    return (
        <section className="@container w-full flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold font-heading text-text-base">Select Items</h2>
                <span className="text-xs font-semibold text-text-muted">
                    {items.length} items in order
                </span>
            </div>

            <div className="flex flex-col gap-4">
                {items.map((item) => {
                    const itemKey = `${item.productId}-${item.variantId ?? 'base'}`;
                    const selected = Boolean(selectedItems[itemKey]);
                    const quantity = selectedItems[itemKey]?.quantity ?? 1;

                    return (
                        <ReturnItemRow
                            key={itemKey}
                            item={item}
                            selected={selected}
                            quantity={quantity}
                            onSelectChange={(nextSelected) => onSelectItem(itemKey, nextSelected)}
                            onQuantityChange={(nextQuantity) => onQuantityChange(itemKey, nextQuantity)}
                        />
                    );
                })}
            </div>
        </section>
    );
}
