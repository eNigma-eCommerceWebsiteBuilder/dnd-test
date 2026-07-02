'use client';

import { formatPrice, calculateCartSavings } from '@/lib/utils';
import { cn } from '@/lib/utils/cn';
import { PromoCodeInput } from './PromoCodeInput';
import { CheckoutButton } from './CheckoutButton';
import { TaxEstimateForm } from './TaxEstimateForm';
import type { TaxLocation, CartItem } from '@/lib/hooks';

interface CartSummaryProps {
    subtotal: number;
    shipping?: number | null;
    tax?: number | null;
    total: number;
    itemCount: number;
    items?: CartItem[];
    onApplyPromo?: (code: string) => Promise<boolean>;
    onEstimateTax?: (location: TaxLocation) => Promise<void>;
    className?: string;
}

/**
 * CartSummary Component (Client)
 * 
 * Order summary panel with:
 * - Subtotal, shipping, tax, total
 * - Savings display (using calculateCartSavings)
 * - Promo code input
 * - Tax estimate form
 * - Checkout button
 * - Security badges
 * 
 * Uses @container queries for responsive layout.
 * Uses theme variables from tailwind.config.ts
 */
export function CartSummary({
    subtotal,
    shipping,
    tax,
    total,
    itemCount,
    items = [],
    onApplyPromo,
    onEstimateTax,
    className
}: CartSummaryProps) {
    const isCartEmpty = itemCount === 0;

    // Calculate savings using lib utility
    const savings = calculateCartSavings(items.map(item => ({
        productId: item.productId,
        price: item.product?.price || item.price,
        salePrice: item.price,
        quantity: item.quantity
    })));

    return (
        <div className={cn(
            "@container bg-bg-surface rounded-card border border-border p-6 @sm:p-8 shadow-card",
            className
        )}>
            <h3 className="text-lg @sm:text-xl font-bold text-text-base mb-4 @sm:mb-6">
                Order Summary
            </h3>

            {/* Summary Lines */}
            <div className="space-y-3 @sm:space-y-4 mb-6 @sm:mb-8">
                {/* Subtotal */}
                <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Subtotal</span>
                    <span className="font-medium text-text-base">
                        {formatPrice(subtotal)}
                    </span>
                </div>

                {/* Savings (if any) */}
                {savings > 0 && (
                    <div className="flex justify-between text-sm">
                        <span className="text-success">Savings</span>
                        <span className="font-medium text-success">
                            -{formatPrice(savings)}
                        </span>
                    </div>
                )}

                {/* Shipping */}
                <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Shipping</span>
                    <span className="font-medium text-primary">
                        {shipping === 0 ? 'Free' :
                            shipping ? formatPrice(shipping) : 'Calculated at checkout'}
                    </span>
                </div>

                {/* Estimated Tax */}
                <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Estimated Tax</span>
                    <span className="font-medium text-text-base">
                        {tax ? formatPrice(tax) : '—'}
                    </span>
                </div>

                {/* Total */}
                <div className="pt-3 @sm:pt-4 border-t border-divider flex justify-between">
                    <span className="text-base @sm:text-lg font-bold text-text-base">Total</span>
                    <span className="text-base @sm:text-lg font-bold text-text-base">
                        {formatPrice(total)}
                    </span>
                </div>
            </div>

            {/* Tax Estimate Form */}
            {onEstimateTax && (
                <TaxEstimateForm
                    onEstimate={onEstimateTax}
                    className="mb-4 @sm:mb-6"
                />
            )}

            {/* Promo Code Input */}
            <PromoCodeInput
                onApply={onApplyPromo}
                className="mb-6 @sm:mb-8"
            />

            {/* Checkout Button */}
            <CheckoutButton disabled={isCartEmpty} />

            {/* Trust Badges */}
            <div className="mt-4 @sm:mt-6 flex flex-col gap-2 @sm:gap-3">
                <div className="flex items-center gap-2 @sm:gap-3 text-xs text-text-muted">
                    <span className="material-symbols-outlined text-base">lock</span>
                    Secure checkout with SSL encryption
                </div>
                <div className="flex items-center gap-2 @sm:gap-3 text-xs text-text-muted">
                    <span className="material-symbols-outlined text-base">refresh</span>
                    30-day free returns on all orders
                </div>
            </div>

            {/* Payment Icons Placeholder */}
            <div className="mt-6 @sm:mt-8 flex items-center gap-3 @sm:gap-4 opacity-disabled grayscale hover:grayscale-0 transition-all">
                <div className="w-8 @sm:w-10 h-5 @sm:h-6 bg-bg-skeleton rounded-badge" />
                <div className="w-8 @sm:w-10 h-5 @sm:h-6 bg-bg-skeleton rounded-badge" />
                <div className="w-8 @sm:w-10 h-5 @sm:h-6 bg-bg-skeleton rounded-badge" />
                <div className="w-8 @sm:w-10 h-5 @sm:h-6 bg-bg-skeleton rounded-badge" />
            </div>
        </div>
    );
}

export default CartSummary;
