'use client';

import { useState } from 'react';
import { useToast } from '@/lib/hooks';
import { cn } from '@/lib/utils';
import type { SetDefaultButtonProps } from './types';
import { setDefaultPaymentMethodAction } from '@/lib/actions/payment-method-actions';

/**
 * Set Default Button Component
 * 
 * Sets a card as the default payment method.
 */
export function SetDefaultButton({ paymentMethodId, isDefault, className }: SetDefaultButtonProps) {
    const { success, error } = useToast();
    const [isPending, setIsPending] = useState(false);

    const handleSetDefault = async () => {
        if (isDefault) return;

        setIsPending(true);
        try {
            const result = await setDefaultPaymentMethodAction(paymentMethodId);

            if (result.success) {
                success("Your default payment method has been updated.");
            } else {
                throw new Error(result.error || 'Failed to update default');
            }
        } catch (err) {
            error(err instanceof Error ? err.message : "Failed to update default");
        } finally {
            setIsPending(false);
        }
    };

    if (isDefault) return null; // Should ideally be handled by parent, but safe check here

    return (
        <button
            type="button"
            onClick={handleSetDefault}
            disabled={isPending}
            className={cn(
                "@container text-sm font-semibold text-primary transition-colors hover:text-primary-dark disabled:opacity-disabled",
                className
            )}
        >
            {isPending ? 'Updating...' : 'Set Default'}
        </button>
    );
}
