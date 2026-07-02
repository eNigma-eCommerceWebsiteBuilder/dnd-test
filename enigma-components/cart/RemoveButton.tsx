'use client';

import { useState } from 'react';
import { useToast } from '@/lib/hooks';
import { cn } from '@/lib/utils/cn';

interface RemoveButtonProps {
    productId: string;
    productName?: string;
    onRemove: (productId: string) => Promise<void>;
    className?: string;
}

/**
 * RemoveButton Component (Client)
 * 
 * Button to remove an item from the cart.
 * Shows loading state during removal.
 * Tracks removal via analytics and shows toast feedback.
 */
export function RemoveButton({
    productId,
    productName,
    onRemove,
    className
}: RemoveButtonProps) {
    const { success, error: showError } = useToast();
    const [isRemoving, setIsRemoving] = useState(false);

    const handleRemove = async () => {
        setIsRemoving(true);
        try {
            await onRemove(productId);

            // Show success toast
            success(
                productName
                    ? `${productName} has been removed from your cart.`
                    : 'Item has been removed from your cart.',
                { title: 'Item Removed' }
            );
        } catch {
            showError('Failed to remove item. Please try again.', {
                title: 'Error'
            });
        } finally {
            setIsRemoving(false);
        }
    };

    return (
        <button
            onClick={handleRemove}
            disabled={isRemoving}
            className={cn(
                "inline-flex items-center gap-1.5 text-sm text-text-muted @container",
                "hover:text-danger transition-colors",
                "disabled:opacity-disabled disabled:cursor-not-allowed",
                className
            )}
            aria-label="Remove item"
        >
            {isRemoving ? (
                <span className="material-symbols-outlined animate-spin text-base">
                    progress_activity
                </span>
            ) : (
                <span className="material-symbols-outlined text-base">
                    delete_outline
                </span>
            )}
            <span className="hidden @sm:inline">Remove</span>
        </button>
    );
}

export default RemoveButton;
