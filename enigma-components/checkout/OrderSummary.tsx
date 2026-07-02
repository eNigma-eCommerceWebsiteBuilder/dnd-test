'use client';

import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils/cn';
import type { CartItem } from '@/lib/api';

interface ShippingMethod {
    id: string;
    name: string;
    price: number;
    estimatedDays: string;
}

interface OrderSummaryProps {
    /** Cart items to display */
    items: CartItem[];
    /** Subtotal amount */
    subtotal: number;
    /** Selected shipping method (optional) */
    shippingMethod?: ShippingMethod | null;
    /** Tax amount (optional) */
    tax?: number | null;
    /** Discount amount (optional) */
    discount?: number;
    /** Total amount */
    total: number;
    /** Number of items in cart */
    itemCount: number;
    /** Whether to show full item details or compact view */
    compact?: boolean;
    /** Additional CSS classes */
    className?: string;
}

/**
 * OrderSummary Component (Client)
 * 
 * Cart summary sidebar for checkout:
 * - Displays cart items with images, names, quantities, prices
 * - Uses calculateCartTotal from lib/utils/ecommerce
 * - Uses formatPrice from lib/utils/formatters
 * - Shows subtotal, shipping, tax, total
 * 
 * Component Design Rules (from PAGE_AND_COMPONENTS_PLAN.md):
 * - Section 2.3: Every structural component must have `@container` on root
 * - Section 2.4: Hardcode functional UI labels: "Order Summary", "Subtotal", "Shipping", etc.
 * - Section 2.1: Use theme variables from tailwind.config.ts
 * - Section 2.2: Start with `w-full` for fluidity
 */
export function OrderSummary({
    items,
    subtotal,
    shippingMethod,
    tax,
    discount = 0,
    total,
    itemCount,
    compact = false,
    className
}: OrderSummaryProps) {
    const shippingCost = shippingMethod?.price || 0;
    const taxAmount = tax || 0;
    const finalTotal = total || (subtotal - discount + shippingCost + taxAmount);

    return (
        <div
            className={cn(
                "@container w-full bg-bg-surface border border-border rounded-card p-4 @sm:p-6 @lg:p-8 shadow-card",
                className
            )}
        >
            {/* Header - Hardcoded functional UI */}
            <h2 className="text-lg @sm:text-xl font-bold text-text-base mb-4 @sm:mb-6">
                Order Summary
            </h2>

            {/* Item List - scrollable if many items */}
            {!compact && items.length > 0 && (
                <div className="space-y-3 @sm:space-y-4 max-h-[250px] @sm:max-h-[300px] overflow-y-auto pr-1 @sm:pr-2 mb-4 @sm:mb-6">
                    {items.map((item) => (
                        <div key={item.productId} className="flex gap-3 @sm:gap-4">
                            {/* Product Image */}
                            <div
                                className="w-14 h-18 @sm:w-16 @sm:h-20 bg-bg-skeleton rounded-image bg-cover bg-center shrink-0"
                                style={{
                                    backgroundImage: item.product?.images?.[0]
                                        ? `url(${item.product.images[0]})`
                                        : undefined
                                }}
                                role="img"
                                aria-label={item.product?.name || 'Product image'}
                            />

                            {/* Product Info */}
                            <div className="flex flex-col justify-between py-0.5 @sm:py-1 flex-1 min-w-0">
                                <div>
                                    <p className="font-semibold text-xs @sm:text-sm text-text-base line-clamp-2">
                                        {item.product?.name || 'Product'}
                                    </p>
                                    {item.variant && (
                                        <p className="text-[10px] @sm:text-xs text-text-muted mt-0.5">
                                            {item.variant.name}
                                        </p>
                                    )}
                                </div>
                                <div className="flex justify-between items-end">
                                    {/* Quantity - Hardcoded label */}
                                    <p className="text-[10px] @sm:text-xs text-text-muted">
                                        Qty: {item.quantity}
                                    </p>
                                    <p className="font-semibold text-xs @sm:text-sm text-text-base">
                                        {formatPrice(item.subtotal || item.price * item.quantity)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Compact mode - just show item count */}
            {compact && (
                <p className="text-sm text-text-muted mb-4">
                    {itemCount} {itemCount === 1 ? 'item' : 'items'} in cart
                </p>
            )}

            {/* Price Breakdown */}
            <div className="space-y-2 @sm:space-y-3 pt-3 @sm:pt-4 border-t border-divider">
                {/* Subtotal - Hardcoded label */}
                <div className="flex justify-between text-xs @sm:text-sm">
                    <span className="text-text-muted">Subtotal</span>
                    <span className="font-medium text-text-base">{formatPrice(subtotal)}</span>
                </div>

                {/* Discount (if any) */}
                {discount > 0 && (
                    <div className="flex justify-between text-xs @sm:text-sm">
                        <span className="text-success">Discount</span>
                        <span className="font-medium text-success">-{formatPrice(discount)}</span>
                    </div>
                )}

                {/* Shipping - Hardcoded label */}
                <div className="flex justify-between text-xs @sm:text-sm">
                    <span className="text-text-muted">Shipping</span>
                    <span className="font-medium text-text-base">
                        {shippingMethod
                            ? shippingMethod.price === 0
                                ? 'Free'
                                : formatPrice(shippingMethod.price)
                            : 'Calculated at next step'
                        }
                    </span>
                </div>

                {/* Tax - Hardcoded label */}
                <div className="flex justify-between text-xs @sm:text-sm">
                    <span className="text-text-muted">Estimated Tax</span>
                    <span className="font-medium text-text-base">
                        {taxAmount > 0 ? formatPrice(taxAmount) : 'Calculated at checkout'}
                    </span>
                </div>

                {/* Total - Hardcoded label */}
                <div className="pt-3 @sm:pt-4 mt-1 @sm:mt-2 border-t border-divider flex justify-between items-end">
                    <div>
                        <p className="text-[10px] @sm:text-xs text-text-muted uppercase tracking-widest font-bold">
                            Total
                        </p>
                        <p className="text-xl @sm:text-2xl @lg:text-3xl font-bold text-primary">
                            {formatPrice(finalTotal)}
                        </p>
                    </div>
                    <p className="text-[10px] @sm:text-xs text-text-muted text-right">
                        {itemCount} {itemCount === 1 ? 'item' : 'items'}
                    </p>
                </div>
            </div>

            {/* Security Badge - Hardcoded functional UI */}
            <div className="mt-4 @sm:mt-6 pt-3 @sm:pt-4 border-t border-divider flex flex-col items-center gap-2 @sm:gap-3">
                <div className="flex items-center gap-1.5 @sm:gap-2 text-[10px] @sm:text-xs text-text-muted font-medium">
                    <span className="material-symbols-outlined text-[12px] @sm:text-[14px]">verified_user</span>
                    <span>SSL Encrypted Secure Checkout</span>
                </div>
            </div>
        </div>
    );
}

export default OrderSummary;
