'use client';

import { useState } from 'react';
import { useToast } from '@/lib/hooks';
import { cn } from '@/lib/utils';
import type { DeleteCardButtonProps } from './types';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { deletePaymentMethodAction } from '@/lib/actions/payment-method-actions';

/**
 * Delete Card Button Component
 * 
 * Handles deletion interaction: button -> modal -> action.
 */
export function DeleteCardButton({ paymentMethodId, className }: DeleteCardButtonProps) {
    const { success, error } = useToast();
    const [showModal, setShowModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const result = await deletePaymentMethodAction(paymentMethodId);

            if (result.success) {
                success("Payment method has been deleted successfully.");
                setShowModal(false);
            } else {
                throw new Error(result.error || 'Failed to delete card');
            }
        } catch (err) {
            error(err instanceof Error ? err.message : "Failed to delete card");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setShowModal(true)}
                className={cn(
                    "@container p-2 text-text-muted hover:text-danger hover:bg-danger-subtle rounded-full transition-colors flex-shrink-0",
                    className
                )}
                aria-label="Remove payment method"
            >
                <span className="material-symbols-outlined text-xl">delete</span>
            </button>

            <DeleteConfirmModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleDelete}
                isDeleting={isDeleting}
                paymentMethodId={paymentMethodId}
            />
        </>
    );
}
