'use client';

import { useState } from 'react';
import { useTransition } from 'react';
import { cancelOrderAction } from '@/lib/actions/order-actions';
import { useToast } from '@/lib/hooks';
import { CancelOrderModal } from './CancelOrderModal';
import { cn } from '@/lib/utils/cn';

/**
 * CancelOrderButton Component (Client)
 * 
 * Button that triggers the cancellation modal and action.
 */
interface CancelOrderButtonProps {
    orderId: string;
    className?: string;
}

export function CancelOrderButton({ orderId, className }: CancelOrderButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const { success, error } = useToast();

    const handleCancel = () => {
        startTransition(async () => {
            try {
                // Pass valid initial state matching ActionState type
                const result = await cancelOrderAction({ success: false }, { orderId });

                if (result.success) {
                    success('Your order has been successfully cancelled.', {
                        title: 'Order Cancelled'
                    });
                    setIsOpen(false);
                } else {
                    error(result.error || 'Failed to cancel order', {
                        title: 'Cancellation Failed'
                    });
                }
            } catch {
                error('An unexpected error occurred', {
                    title: 'Error'
                });
            }
        });
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className={cn(
                    "@container rounded-button border border-danger px-4 py-2 text-sm font-semibold text-danger transition-colors hover:bg-danger-subtle",
                    className
                )}
            >
                Cancel Order
            </button>

            <CancelOrderModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onConfirm={handleCancel}
                isPending={isPending}
            />
        </>
    );
}
