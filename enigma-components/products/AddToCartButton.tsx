'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { useCart, useToast } from '@/lib/hooks';

interface AddToCartButtonProps {
    productId: string;
    quantity?: number;
    variantId?: string;
    disabled?: boolean;
    inStock?: boolean;
    className?: string;
}

export function AddToCartButton({
    productId,
    quantity = 1,
    variantId,
    disabled = false,
    inStock = true,
    className
}: AddToCartButtonProps) {
    const { addItem } = useCart(false);
    const { success, error: showError } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleAddToCart = async () => {
        if (!inStock || disabled || isLoading) return;

        setIsLoading(true);
        try {
            await addItem(productId, quantity, variantId);
            success('Added to cart');
        } catch {
            showError('Failed to add to cart');
        } finally {
            setIsLoading(false);
        }
    };

    const isDisabled = disabled || !inStock || isLoading;

    return (
        <button
            type="button"
            onClick={handleAddToCart}
            disabled={isDisabled}
            className={cn(
                "@container flex flex-1 items-center justify-center gap-2 rounded-button bg-cta-primary py-4 text-on-primary shadow-button",
                "font-semibold transition-all duration-normal",
                "hover:bg-cta-primary-hover hover:shadow-button-hover",
                "disabled:cursor-not-allowed disabled:opacity-disabled disabled:hover:bg-cta-primary",
                className
            )}
            aria-busy={isLoading}
        >
            {isLoading ? (
                <>
                    <span className="material-symbols-outlined animate-spin text-xl">
                        progress_activity
                    </span>
                    Adding...
                </>
            ) : !inStock ? (
                'Out of Stock'
            ) : (
                <>
                    <span className="material-symbols-outlined">shopping_cart</span>
                    Add to Cart
                </>
            )}
        </button>
    );
}

export default AddToCartButton;
