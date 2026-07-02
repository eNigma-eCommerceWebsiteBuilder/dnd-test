import type { Order } from '@/lib/api/types';
import { cn } from '@/lib/utils/cn';
import { formatPrice } from '@/lib/utils/formatters';

/**
 * OrderItemList Component
 * 
 * Displays the list of purchased items.
 * 
 * Design Principles:
 * - @container for responsive layout
 * - Fluid images with aspect-square
 * - Theme colors
 */
interface OrderItemListProps {
    items: Order['items']; // Use indexed access for items type
    className?: string;
}

export function OrderItemList({ items, className }: OrderItemListProps) {
    return (
        <div className={cn("@container bg-bg-surface rounded-card shadow-card overflow-hidden divide-y divide-divider", className)}>
            {items.map((item, index) => (
                <div key={`${item.productId}-${index}`} className="flex items-center gap-4 p-4 @md:gap-6 @md:p-6">
                    <div
                        className="h-16 w-16 flex-shrink-0 rounded-image bg-bg-skeleton bg-cover bg-center bg-no-repeat aspect-square @md:h-20 @md:w-20"
                        style={{
                            backgroundImage: item.product?.images?.[0]
                                ? `url("${item.product.images[0]}")`
                                : undefined
                        }}
                        aria-label={item.product?.name || 'Product image'}
                    />

                    <div className="flex flex-1 justify-between items-start">
                        <div>
                            <h3 className="text-base font-semibold text-text-base @md:text-lg">
                                {item.product?.name || 'Product'}
                            </h3>
                            {item.variant && (
                                <p className="text-xs text-text-muted @md:text-sm">
                                    {item.variant.name}
                                </p>
                            )}
                            <p className="mt-1 text-xs text-text-muted @md:text-sm">
                                Qty: {item.quantity}
                            </p>
                        </div>
                        <p className="text-base font-medium text-text-base @md:text-lg">
                            {formatPrice(item.subtotal)}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
