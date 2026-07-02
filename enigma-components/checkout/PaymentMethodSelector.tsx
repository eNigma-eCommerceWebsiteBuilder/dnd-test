'use client';

import { cn } from '@/lib/utils/cn';

export interface PaymentMethodOption {
    id: string;
    name: string;
    icon?: string;
}

interface PaymentMethodSelectorProps {
    methods: PaymentMethodOption[];
    selectedMethodId: string;
    onSelect: (id: string) => void;
    isLoading?: boolean;
    className?: string;
}

/**
 * PaymentMethodSelector Component (Client)
 * 
 * Tab-like selector for payment methods (Credit Card, PayPal, etc.)
 * 
 * Component Design Rules (from PAGE_AND_COMPONENTS_PLAN.md):
 * - Section 2.3: Every structural component must have `@container` on root
 * - Section 2.1: Use theme variables (bg-surface, border, primary)
 */
export function PaymentMethodSelector({
    methods,
    selectedMethodId,
    onSelect,
    isLoading = false,
    className
}: PaymentMethodSelectorProps) {
    return (
        <div className={cn("@container w-full", className)}>
            <div className="grid grid-cols-2 @sm:grid-cols-3 gap-3">
                {methods.map((method) => {
                    const isSelected = selectedMethodId === method.id;

                    return (
                        <button
                            key={method.id}
                            type="button"
                            onClick={() => onSelect(method.id)}
                            disabled={isLoading}
                            className={cn(
                                "flex flex-col items-center justify-center gap-2 p-3 @sm:p-4 rounded-card border-2 transition-all h-24",
                                isSelected
                                    ? "border-primary bg-primary/5 text-primary"
                                    : "border-border bg-bg-surface text-text-muted hover:border-border-hover hover:bg-bg-hover",
                                "focus:outline-none focus:ring-2 focus:ring-primary/20",
                                "disabled:opacity-disabled disabled:cursor-not-allowed"
                            )}
                            role="radio"
                            aria-checked={isSelected}
                        >
                            <span className="material-symbols-outlined text-2xl mb-1">
                                {method.icon || 'credit_card'}
                            </span>
                            <span className="text-sm font-medium">{method.name}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default PaymentMethodSelector;
