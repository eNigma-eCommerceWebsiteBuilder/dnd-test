'use client';

import { cn } from '@/lib/utils/cn';

interface PlaceOrderButtonProps {
    onClick: () => void;
    isLoading?: boolean;
    disabled?: boolean;
    totalAmount?: string; // Optional formatted total to show on button
    className?: string;
}

/**
 * PlaceOrderButton Component (Client)
 * 
 * Primary CTA for finalizing the order.
 * 
 * Component Design Rules (from PAGE_AND_COMPONENTS_PLAN.md):
 * - Section 2.3: Every structural component must have `@container` on root
 * - Section 2.4: Hardcode functional UI text ("Place Order", "Processing...")
 * - Section 2.1: Use theme variables
 */
export function PlaceOrderButton({
    onClick,
    isLoading = false,
    disabled = false,
    totalAmount,
    className
}: PlaceOrderButtonProps) {
    return (
        <div className={cn("@container w-full", className)}>
            <button
                type="button"
                onClick={onClick}
                disabled={disabled || isLoading}
                className={cn(
                    "w-full py-4 px-6 rounded-button font-bold text-lg shadow-button transition-all",
                    "flex items-center justify-between",
                    disabled || isLoading
                        ? "bg-bg-disabled text-text-disabled cursor-not-allowed shadow-none"
                        : "bg-primary text-on-primary hover:bg-primary-dark hover:shadow-button-hover"
                )}
            >
                <span className="flex items-center gap-2">
                    {isLoading ? (
                        <>
                            <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            <span>Processing...</span>
                        </>
                    ) : (
                        <>
                            <span>Place Order</span>
                            <span className="material-symbols-outlined">lock</span>
                        </>
                    )}
                </span>

                {/* Optional amount display on button */}
                {totalAmount && !isLoading && (
                    <span className="opacity-90">{totalAmount}</span>
                )}
            </button>

            <p className="text-xs text-center text-text-muted mt-3">
                By placing this order, you agree to our Terms of Service and Privacy Policy.
            </p>
        </div>
    );
}

export default PlaceOrderButton;
