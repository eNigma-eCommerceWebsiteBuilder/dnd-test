'use client';

import { cn } from '@/lib/utils/cn';
import { CartItem } from './CartItem';
import type { CartItem as CartItemType } from '@/lib/hooks';

interface CartItemListProps {
    items: CartItemType[];
    onUpdateQuantity: (productId: string, quantity: number) => Promise<void>;
    onRemove: (productId: string) => Promise<void>;
    isPending?: boolean;
    className?: string;
}

/**
 * CartItemList Component (Client)
 * 
 * Renders list of CartItem components.
 * Handles update and remove callbacks.
 * Uses @container queries for responsive layout.
 */
export function CartItemList({
    items,
    onUpdateQuantity,
    onRemove,
    isPending = false,
    className
}: CartItemListProps) {
    if (items.length === 0) {
        return null;
    }

    return (
        <div className={cn("@container w-full", className)}>
            <div className="flex flex-col border-t border-border">
                {items.map((item) => (
                    <CartItem
                        key={item.productId}
                        item={item}
                        onUpdateQuantity={onUpdateQuantity}
                        onRemove={onRemove}
                        isPending={isPending}
                    />
                ))}
            </div>
        </div>
    );
}

export default CartItemList;
