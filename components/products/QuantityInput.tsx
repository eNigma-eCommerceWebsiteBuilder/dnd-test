'use client';

import { cn } from '@/lib/utils/cn';

interface QuantityInputProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    disabled?: boolean;
    className?: string;
}

/**
 * QuantityInput Component (Client)
 * 
 * +/- quantity control following LUXE design:
 * - Bordered container with buttons
 * - Min/max limits
 * - Keyboard input support
 */
export function QuantityInput({
    value,
    onChange,
    min = 1,
    max = 99,
    disabled = false,
    className
}: QuantityInputProps) {
    const handleDecrement = () => {
        if (value > min) {
            onChange(value - 1);
        }
    };

    const handleIncrement = () => {
        if (value < max) {
            onChange(value + 1);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(e.target.value, 10);
        if (!isNaN(newValue) && newValue >= min && newValue <= max) {
            onChange(newValue);
        }
    };

    return (
        <div
            className={cn(
                "flex shrink-0 items-center rounded-input border border-border bg-bg-surface px-2",
                disabled && "opacity-disabled",
                className
            )}
        >
            <button
                type="button"
                onClick={handleDecrement}
                disabled={disabled || value <= min}
                className="p-2 text-text-muted hover:text-text-base disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Decrease quantity"
            >
                <span className="material-symbols-outlined text-lg">remove</span>
            </button>

            <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={value}
                onChange={handleInputChange}
                disabled={disabled}
                className="w-12 text-center border-none focus:ring-0 font-bold bg-transparent text-text-base"
                aria-label="Quantity"
            />

            <button
                type="button"
                onClick={handleIncrement}
                disabled={disabled || value >= max}
                className="p-2 text-text-muted hover:text-text-base disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Increase quantity"
            >
                <span className="material-symbols-outlined text-lg">add</span>
            </button>
        </div>
    );
}

export default QuantityInput;
