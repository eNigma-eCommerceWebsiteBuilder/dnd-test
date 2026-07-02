'use client';

import { useMemo } from 'react';

interface QuantitySelectorProps {
    quantity: number;
    min: number;
    max: number;
    onChange: (nextQuantity: number) => void;
    disabled?: boolean;
}

export function QuantitySelector({
    quantity,
    min,
    max,
    onChange,
    disabled = false,
}: QuantitySelectorProps) {
    const canDecrease = quantity > min;
    const canIncrease = quantity < max;

    const displayValue = useMemo(() => {
        if (Number.isNaN(quantity)) return min;
        return Math.max(min, Math.min(max, quantity));
    }, [max, min, quantity]);

    return (
        <div
            className="@container w-full inline-flex items-center rounded-input border border-border bg-input-bg text-text-base shadow-input"
            aria-disabled={disabled}
        >
            <button
                type="button"
                className="px-3 py-1.5 text-sm font-semibold text-text-muted hover:text-primary disabled:opacity-disabled"
                onClick={() => onChange(displayValue - 1)}
                disabled={disabled || !canDecrease}
                aria-label="Decrease quantity"
            >
                −
            </button>
            <span className="min-w-[32px] text-center text-sm font-semibold">
                {displayValue}
            </span>
            <button
                type="button"
                className="px-3 py-1.5 text-sm font-semibold text-text-muted hover:text-primary disabled:opacity-disabled"
                onClick={() => onChange(displayValue + 1)}
                disabled={disabled || !canIncrease}
                aria-label="Increase quantity"
            >
                +
            </button>
        </div>
    );
}
