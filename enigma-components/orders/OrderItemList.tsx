import { Order } from '@/lib/api/types';
import { cn } from '@/lib/utils/cn';
import { formatPrice } from '@/lib/utils/formatters';

/**
 * OrderItemList Component (Server)
 * 
 * Displays the list of items in an order.
 * 
 * Per PAGE_AND_COMPONENTS_PLAN.md Section 2.3:
 * - Uses @container for responsive layout
 * - Uses container queries for internal responsiveness
 * 
 * Per Section 2.2:
 * - Fluid images with aspect-square
 * - Theme colors
 */
interface OrderItemListProps {
    items: Order['items'];
    className?: string;
}

export function OrderItemList({ items, className }: OrderItemListProps) {
    return (
        <div
            className={cn(
                "@container bg-bg-surface rounded-card shadow-card overflow-hidden divide-y divide-divider border border-border",
                className
            )}
        >
            {items.map((item, index) => (
                <div key={`${item.productId}-${index}`} className="flex flex-col @md:flex-row @md:items-center gap-4 @md:gap-6 p-4 @md:p-6">
                    {/* Product Image */}
                    <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-image w-20 h-20 @md:w-24 @md:h-24 flex-shrink-0 bg-bg-sunken border border-border-light"
                        style={{
                            backgroundImage: item.product?.images?.[0]
                                ? `url("${item.product.images[0]}")`
                                : undefined
                        }}
                        aria-label={item.product?.name || 'Product image'}
                    />

                    {/* Item Details */}
                    <div className="flex flex-1 flex-col @md:flex-row justify-between items-start @md:items-center w-full gap-4">
                        <div className="space-y-1">
                            <h3 className="font-semibold text-base @md:text-lg text-text-base line-clamp-2">
                                {item.product?.name || 'Product'}
                            </h3>
                            {item.variant && (
                                <p className="text-sm text-text-muted">
                                    Variant: <span className="text-text-base">{item.variant.name}</span>
                                </p>
                            )}
                            <div className="flex items-center gap-4 text-sm text-text-muted">
                                <p>Qty: <span className="text-text-base font-medium">{item.quantity}</span></p>
                                <p>Price: <span className="text-text-base font-medium">{formatPrice(item.price)}</span></p>
                            </div>
                        </div>

                        <p className="text-lg font-bold text-text-base @md:text-xl">
                            {formatPrice(item.subtotal)}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
