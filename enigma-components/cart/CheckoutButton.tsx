'use client';

import Link from 'next/link';
import { ROUTES } from '@/lib/utils';
import { cn } from '@/lib/utils/cn';

interface CheckoutButtonProps {
    disabled?: boolean;
    className?: string;
}

/**
 * CheckoutButton Component (Client)
 * 
 * Primary CTA button to proceed to checkout.
 * Disabled when cart is empty.
 * Uses @container queries for responsive layout.
 * Uses theme variables from tailwind.config.ts
 */
export function CheckoutButton({ disabled = false, className }: CheckoutButtonProps) {
    if (disabled) {
        return (
            <div className={cn("@container w-full", className)}>
                <button
                    disabled
                    className={cn(
                        "w-full py-3 @sm:py-4 rounded-button font-bold text-base @sm:text-lg",
                        "bg-bg-disabled text-text-disabled",
                        "cursor-not-allowed flex items-center justify-center gap-2"
                    )}
                >
                    <span>Proceed to Checkout</span>
                    <span className="material-symbols-outlined text-lg @sm:text-xl">arrow_forward</span>
                </button>
            </div>
        );
    }

    return (
        <div className={cn("@container w-full", className)}>
            <Link
                href={ROUTES.CHECKOUT}
                className={cn(
                    "w-full py-3 @sm:py-4 rounded-button font-bold text-base @sm:text-lg",
                    "bg-primary hover:bg-primary-dark text-on-primary",
                    "shadow-button hover:shadow-button-hover transition-all",
                    "flex items-center justify-center gap-2"
                )}
            >
                <span>Proceed to Checkout</span>
                <span className="material-symbols-outlined text-lg @sm:text-xl">arrow_forward</span>
            </Link>
        </div>
    );
}

export default CheckoutButton;
