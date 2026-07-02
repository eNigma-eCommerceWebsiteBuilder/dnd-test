'use client';

import { useState, useTransition } from 'react';
import { cn } from '@/lib/utils/cn';
import { useToast } from '@/lib/hooks';
import { cancelReturnAction } from '@/lib/actions/returns-actions';
import { useReturnActions } from '@/lib/hooks';
import type { ReturnStatus } from '@/lib/api/types/returns';
import { CancelConfirmModal } from '@/components/returns/CancelConfirmModal';

interface CancelReturnButtonProps {
    returnId: string;
    status: ReturnStatus;
    className?: string;
    onCancelled?: () => void;
    confirm?: boolean;
}

export function CancelReturnButton({
    returnId,
    status,
    className,
    onCancelled,
    confirm = true,
}: CancelReturnButtonProps) {
    const [isPending, startTransition] = useTransition();
    const [isOpen, setIsOpen] = useState(false);
    const { success, error } = useToast();
    const { canCancel } = useReturnActions();

    const isEligible = canCancel(status);

    const handleCancel = () => {
        if (!isEligible) return;

        if (confirm) {
            setIsOpen(true);
            return;
        }

        startTransition(async () => {
            try {
                const result = await cancelReturnAction({ success: false }, { returnId });

                if (result.success) {
                    success('Your return has been cancelled.', { title: 'Return Cancelled' });
                    onCancelled?.();
                } else {
                    error(result.error || 'Failed to cancel return', { title: 'Cancellation Failed' });
                }
            } catch {
                error('An unexpected error occurred', { title: 'Error' });
            }
        });
    };

    const handleConfirm = () => {
        startTransition(async () => {
            try {
                const result = await cancelReturnAction({ success: false }, { returnId });

                if (result.success) {
                    success('Your return has been cancelled.', { title: 'Return Cancelled' });
                    onCancelled?.();
                    setIsOpen(false);
                } else {
                    error(result.error || 'Failed to cancel return', { title: 'Cancellation Failed' });
                }
            } catch {
                error('An unexpected error occurred', { title: 'Error' });
            }
        });
    };

    return (
        <>
            <button
                type="button"
                onClick={handleCancel}
                disabled={!isEligible || isPending}
                className={cn(
                    '@container w-full inline-flex items-center justify-center gap-2 rounded-button px-4 py-2 text-sm font-semibold border border-danger text-danger hover:bg-danger-subtle transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
                    className
                )}
            >
                <span className="material-symbols-outlined text-lg">close</span>
                Cancel return
            </button>
            <CancelConfirmModal
                isOpen={isOpen}
                isPending={isPending}
                onClose={() => setIsOpen(false)}
                onConfirm={handleConfirm}
            />
        </>
    );
}
