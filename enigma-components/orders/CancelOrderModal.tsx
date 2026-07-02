'use client';

import { useEffect, useId, useRef } from 'react';

interface CancelOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isPending: boolean;
}

export function CancelOrderModal({ isOpen, onClose, onConfirm, isPending }: CancelOrderModalProps) {
    const dialogRef = useRef<HTMLDivElement>(null);
    const titleId = useId();
    const descriptionId = useId();

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="@container fixed inset-0 z-modal flex items-center justify-center px-4">
            <button
                type="button"
                aria-label="Close cancellation modal"
                onClick={onClose}
                className="absolute inset-0 z-modal-backdrop bg-bg-overlay opacity-overlay backdrop-blur-modal"
            />
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={descriptionId}
                className="@container relative z-modal w-full max-w-md rounded-modal border border-border bg-bg-surface p-6 shadow-modal animate-scale-in"
            >
                <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-danger-subtle text-danger">
                            <span className="material-symbols-outlined">warning</span>
                        </div>
                        <div>
                            <h3 id={titleId} className="text-lg font-bold text-text-base">
                                Cancel Order?
                            </h3>
                            <p id={descriptionId} className="mt-1 text-sm text-text-muted">
                                Are you sure you want to cancel this order? This action cannot be undone.
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 flex flex-col-reverse gap-3 @sm:flex-row">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isPending}
                            className="w-full rounded-button border border-border px-4 py-2 font-semibold text-text-base transition-colors hover:bg-bg-hover disabled:opacity-disabled @sm:w-1/2"
                        >
                            Keep Order
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={isPending}
                            className="flex w-full items-center justify-center gap-2 rounded-button bg-danger px-4 py-2 font-semibold text-on-danger shadow-button transition-all duration-normal hover:bg-danger-dark hover:shadow-button-hover disabled:cursor-not-allowed disabled:opacity-disabled @sm:w-1/2"
                        >
                            {isPending ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    Cancelling...
                                </>
                            ) : (
                                'Yes, Cancel'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
