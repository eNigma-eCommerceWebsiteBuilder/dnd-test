'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils/cn';
import { formatPrice } from '@/lib/utils';

export interface ShippingMethod {
    id: string;
    name: string;
    description?: string;
    price: number;
    estimatedDays: string;
}

interface ShippingMethodSelectorProps {
    /** Available shipping methods */
    methods: ShippingMethod[];
    /** Currently selected method ID */
    selectedMethodId?: string;
    /** Callback when method is selected */
    onSelect: (method: ShippingMethod) => void;
    /** Whether selector is in loading state */
    isLoading?: boolean;
    /** Additional CSS classes */
    className?: string;
}

/**
 * ShippingMethodSelector Component (Client)
 * 
 * Shipping options selection with:
 * - Radio button list for shipping methods
 * - Shows: method name, delivery time, price
 * - Selected state with primary border and subtle background
 * 
 * Component Design Rules (from PAGE_AND_COMPONENTS_PLAN.md):
 * - Section 2.3: Every structural component must have `@container` on root
 * - Section 2.4: Hardcode functional UI text (section header, delivery labels)
 * - Section 2.1: Use theme variables from tailwind.config.ts
 */
export function ShippingMethodSelector({
    methods,
    selectedMethodId,
    onSelect,
    isLoading = false,
    className
}: ShippingMethodSelectorProps) {
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    const handleSelect = useCallback((method: ShippingMethod) => {
        if (!isLoading) {
            onSelect(method);
        }
    }, [isLoading, onSelect]);

    // Default methods if none provided
    const displayMethods = methods.length > 0 ? methods : [
        { id: 'standard', name: 'Standard Shipping', price: 5.99, estimatedDays: '5-7 business days' },
        { id: 'express', name: 'Express Shipping', price: 14.99, estimatedDays: '2-3 business days' },
        { id: 'overnight', name: 'Overnight Shipping', price: 29.99, estimatedDays: '1 business day' },
    ];

    return (
        <div className={cn("@container w-full", className)}>
            {/* Section Header - Hardcoded functional UI */}
            <div className="mb-4 @sm:mb-6">
                <h3 className="text-lg @sm:text-xl font-bold text-text-base">
                    Shipping Method
                </h3>
                <p className="text-sm text-text-muted mt-1">
                    Choose how you want your order delivered
                </p>
            </div>

            {/* Shipping Methods List */}
            <div className="space-y-3 @sm:space-y-4">
                {displayMethods.map((method) => {
                    const isSelected = selectedMethodId === method.id;
                    const isHovered = hoveredId === method.id;

                    return (
                        <button
                            key={method.id}
                            type="button"
                            onClick={() => handleSelect(method)}
                            onMouseEnter={() => setHoveredId(method.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            disabled={isLoading}
                            className={cn(
                                "w-full p-4 @sm:p-5 rounded-card border-2 text-left transition-all",
                                isSelected
                                    ? "border-primary bg-primary/5"
                                    : isHovered
                                        ? "border-border-hover bg-bg-hover"
                                        : "border-border bg-bg-surface",
                                "disabled:opacity-disabled disabled:cursor-not-allowed",
                                "focus:outline-none focus:ring-2 focus:ring-primary/20"
                            )}
                            role="radio"
                            aria-checked={isSelected}
                        >
                            <div className="flex items-start @sm:items-center justify-between gap-4">
                                {/* Left: Radio + Method Info */}
                                <div className="flex items-start @sm:items-center gap-3 @sm:gap-4 flex-1">
                                    {/* Radio Circle */}
                                    <div className={cn(
                                        "w-5 h-5 @sm:w-6 @sm:h-6 rounded-full border-2 flex-shrink-0",
                                        "flex items-center justify-center transition-colors",
                                        isSelected
                                            ? "border-primary bg-primary"
                                            : "border-input-border bg-bg-surface"
                                    )}>
                                        {isSelected && (
                                            <div className="w-2 h-2 @sm:w-2.5 @sm:h-2.5 rounded-full bg-on-primary" />
                                        )}
                                    </div>

                                    {/* Method Details */}
                                    <div className="flex-1 min-w-0">
                                        <p className={cn(
                                            "font-semibold text-sm @sm:text-base",
                                            isSelected ? "text-primary" : "text-text-base"
                                        )}>
                                            {method.name}
                                        </p>
                                        {method.description && (
                                            <p className="text-xs @sm:text-sm text-text-muted mt-0.5 line-clamp-1">
                                                {method.description}
                                            </p>
                                        )}
                                        {/* Estimated delivery - Hardcoded label */}
                                        <p className="text-xs @sm:text-sm text-text-muted mt-0.5 @sm:mt-1">
                                            Estimated delivery: {method.estimatedDays}
                                        </p>
                                    </div>
                                </div>

                                {/* Right: Price */}
                                <div className="text-right flex-shrink-0">
                                    <p className={cn(
                                        "font-bold text-sm @sm:text-base",
                                        isSelected ? "text-primary" : "text-text-base"
                                    )}>
                                        {method.price === 0 ? 'Free' : formatPrice(method.price)}
                                    </p>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Loading Indicator */}
            {isLoading && (
                <div className="mt-4 text-center">
                    <span className="text-sm text-text-muted">
                        Loading shipping options...
                    </span>
                </div>
            )}
        </div>
    );
}

export default ShippingMethodSelector;
