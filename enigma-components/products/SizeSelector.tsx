'use client';

import { cn } from '@/lib/utils/cn';

interface SizeSelectorProps {
    sizes: string[];
    selectedSize: string | null;
    onSizeChange: (size: string) => void;
    unavailableSizes?: string[];
    className?: string;
}

/**
 * SizeSelector Component (Client)
 * 
 * Size option buttons following LUXE design:
 * - Horizontal button group
 * - Selected state with primary border
 * - Disabled state for out-of-stock sizes
 */
export function SizeSelector({
    sizes,
    selectedSize,
    onSizeChange,
    unavailableSizes = [],
    className
}: SizeSelectorProps) {
    if (!sizes || sizes.length === 0) {
        return null;
    }

    return (
        <div className={cn("@container flex flex-wrap gap-3", className)}>
            {sizes.map((size) => {
                const isSelected = selectedSize === size;
                const isUnavailable = unavailableSizes.includes(size);

                return (
                    <button
                        key={size}
                        type="button"
                        onClick={() => !isUnavailable && onSizeChange(size)}
                        disabled={isUnavailable}
                        className={cn(
                            "rounded-button px-5 py-2.5 text-sm font-semibold transition-all",
                            isSelected
                                ? "border-2 border-primary text-primary"
                                : "border border-border text-text-base hover:border-primary",
                            isUnavailable && "cursor-not-allowed opacity-disabled line-through"
                        )}
                        aria-pressed={isSelected}
                        aria-label={`Size ${size}${isUnavailable ? ' - unavailable' : ''}`}
                    >
                        {size}
                    </button>
                );
            })}
        </div>
    );
}

export default SizeSelector;
