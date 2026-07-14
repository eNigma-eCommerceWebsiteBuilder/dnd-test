'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { ColorSwatch } from './ColorSwatch';
import { SizeSelector } from './SizeSelector';
import type { ProductColor, ProductVariant } from '@/lib/api/types';

interface VariantSelectorProps {
    colors?: ProductColor[];
    sizes?: string[];
    variants?: ProductVariant[];
    selectedColor: string | null;
    selectedSize: string | null;
    onColorChange: (color: string) => void;
    onSizeChange: (size: string) => void;
    className?: string;
}

/**
 * VariantSelector Component (Client)
 * 
 * Container for color and size selection following LUXE design.
 * Handles variant availability logic.
 */
export function VariantSelector({
    colors,
    sizes,
    variants,
    selectedColor,
    selectedSize,
    onColorChange,
    onSizeChange,
    className
}: VariantSelectorProps) {
    const [showSizeGuide, setShowSizeGuide] = useState(false);

    // Determine unavailable sizes based on selected color and variant stock
    const getUnavailableSizes = (): string[] => {
        if (!variants || !selectedColor) return [];

        const unavailable: string[] = [];
        sizes?.forEach(size => {
            const variant = variants.find(
                v => v.color?.name === selectedColor && v.size === size
            );
            if (variant && (variant.stock === 0 || variant.isActive === false)) {
                unavailable.push(size);
            }
        });
        return unavailable;
    };

    // Get selected color name for display
    const selectedColorData = colors?.find(c => c.name === selectedColor);

    return (
        <div className={cn("@container space-y-6", className)}>
            {/* Color Selector */}
            {colors && colors.length > 0 && (
                <div className="space-y-4">
                    <label className="text-sm font-bold uppercase tracking-widest text-text-base">
                        Color: {selectedColorData?.name || 'Select'}
                    </label>
                    <div className="flex gap-4">
                        {colors.map((color) => (
                            <ColorSwatch
                                key={color.name}
                                color={color}
                                isSelected={selectedColor === color.name}
                                onClick={() => onColorChange(color.name)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Size Selector */}
            {sizes && sizes.length > 0 && (
                <div className="space-y-4">
                    <div className="flex justify-between">
                        <label className="text-sm font-bold uppercase tracking-widest text-text-base">
                            Size
                        </label>
                        <button
                            onClick={() => setShowSizeGuide(true)}
                            className="text-xs font-bold text-primary hover:underline"
                        >
                            SIZE GUIDE
                        </button>
                    </div>
                    <SizeSelector
                        sizes={sizes}
                        selectedSize={selectedSize}
                        onSizeChange={onSizeChange}
                        unavailableSizes={getUnavailableSizes()}
                    />
                </div>
            )}

            {/* Size Guide Modal Placeholder */}
            {showSizeGuide && (
                <div
                    className="fixed inset-0 bg-bg-overlay z-modal flex items-center justify-center p-4"
                    onClick={() => setShowSizeGuide(false)}
                >
                    <div
                        className="bg-bg-surface rounded-modal p-6 max-w-lg w-full shadow-modal"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">Size Guide</h3>
                            <button
                                onClick={() => setShowSizeGuide(false)}
                                className="p-1 hover:bg-bg-hover rounded-full"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <p className="text-text-muted text-sm">
                            Size guide information will be displayed here.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default VariantSelector;
