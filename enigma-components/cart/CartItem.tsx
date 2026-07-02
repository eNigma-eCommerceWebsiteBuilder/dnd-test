'use client';

import Image from 'next/image';
import { formatPrice, calculateItemTotal, CART_LIMITS } from '@/lib/utils';
import { cn } from '@/lib/utils/cn';
import { QuantityInput } from '@/components/products/QuantityInput';
import { RemoveButton } from './RemoveButton';
import type { CartItem as CartItemType } from '@/lib/hooks';

interface CartItemProps {
    item: CartItemType;
    onUpdateQuantity: (productId: string, quantity: number) => Promise<void>;
    onRemove: (productId: string) => Promise<void>;
    isPending?: boolean;
}

/**
 * CartItem Component (Client)
 * 
 * Single cart item row showing:
 * - Product image
 * - Name, variant info (size, color)
 * - Price display
 * - Low stock badge if applicable
 * - Quantity controls
 * - Remove button
 * 
 * Uses @container queries for responsive layout.
 * Uses theme variables from tailwind.config.ts
 */
export function CartItem({
    item,
    onUpdateQuantity,
    onRemove,
    isPending = false
}: CartItemProps) {

    // Get product data from the item
    const product = item.product;
    const imageUrl = product?.images?.[0] || '/placeholder.jpg';
    const name = product?.name || 'Product';
    const isLowStock = (product?.stock ?? 999) <= 5 && (product?.stock ?? 999) > 0;

    // Use lib utility for item total calculation
    const itemTotal = calculateItemTotal({
        productId: item.productId,
        price: item.price,
        salePrice: item.price, // Use current price as sale price
        quantity: item.quantity
    });

    // Build variant description from the variant object
    const variantParts: string[] = [];
    if (item.variant) {
        if (item.variant.size) variantParts.push(`Size: ${item.variant.size}`);
        if (item.variant.color) variantParts.push(`Color: ${item.variant.color}`);
    }
    const variantDescription = variantParts.join(' • ');

    const handleQuantityChange = (newQuantity: number) => {
        onUpdateQuantity(item.productId, newQuantity);
    };

    return (
        <div
            className={cn(
                "@container",
                isPending && "opacity-disabled"
            )}
        >
            <div className={cn(
                "flex flex-col @sm:flex-row items-start gap-4 @sm:gap-6 py-6 @sm:py-8 border-b border-divider"
            )}>
                {/* Product Image */}
                <div className="w-full @sm:w-28 @md:w-32 h-32 @sm:h-36 @md:h-40 relative rounded-image overflow-hidden shrink-0 bg-bg-sunken">
                    <Image
                        src={imageUrl}
                        alt={name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 128px"
                    />
                </div>

                {/* Product Details */}
                <div className="flex-1 flex flex-col justify-between min-h-[100px] @sm:h-36 @md:h-40 py-1 w-full">
                    {/* Top Row: Name, Variant, Price */}
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-base @sm:text-lg font-semibold text-text-base mb-1">
                                {name}
                            </h3>
                            {variantDescription && (
                                <p className="text-xs @sm:text-sm text-text-muted">
                                    {variantDescription}
                                </p>
                            )}
                            {isLowStock && (
                                <div className="mt-2 inline-flex px-2 py-1 bg-stock-low/10 text-stock-low text-[10px] font-bold uppercase tracking-wider rounded-badge">
                                    Low Stock
                                </div>
                            )}
                        </div>
                        <p className="text-base @sm:text-lg font-bold text-price">
                            {formatPrice(itemTotal)}
                        </p>
                    </div>

                    {/* Bottom Row: Quantity Controls, Remove Button */}
                    <div className="flex justify-between items-center mt-3 @sm:mt-0">
                        <QuantityInput
                            value={item.quantity}
                            onChange={handleQuantityChange}
                            min={1}
                            max={CART_LIMITS.MAX_QUANTITY_PER_ITEM}
                            disabled={isPending}
                            className="bg-bg-sunken rounded-button"
                        />
                        <RemoveButton
                            productId={item.productId}
                            onRemove={onRemove}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartItem;
