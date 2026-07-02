'use client';

import { cn } from '@/lib/utils/cn';

interface ColorSwatchProps {
    color: {
        name: string;
        hex: string;
    };
    isSelected: boolean;
    onClick: () => void;
    disabled?: boolean;
}

/**
 * ColorSwatch Component (Client)
 * 
 * Color option button following LUXE design:
 * - Outer ring with selection state
 * - Inner circle with actual color
 */
export function ColorSwatch({
    color,
    isSelected,
    onClick,
    disabled = false
}: ColorSwatchProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "@container size-10 rounded-full p-0.5 bg-bg-surface transition-all",
                isSelected
                    ? "border-2 border-primary"
                    : "border-2 border-transparent hover:border-border",
                disabled && "opacity-50 cursor-not-allowed"
            )}
            title={color.name}
            aria-label={`Select ${color.name} color`}
            aria-pressed={isSelected}
        >
            <div
                className="w-full h-full rounded-full"
                style={{ backgroundColor: color.hex }}
            />
        </button>
    );
}

export default ColorSwatch;
