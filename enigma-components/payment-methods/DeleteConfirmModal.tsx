'use client';

import { cn } from '@/lib/utils/cn';
import type { DeleteConfirmModalProps } from './types';

export function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    isDeleting,
}: DeleteConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="@container fixed inset-0 z-modal flex items-center justify-center p-4">
            <button
                type="button"
                aria-label="Close delete confirmation modal"
                onClick={onClose}
                className="absolute inset-0 z-modal-backdrop bg-bg-overlay opacity-overlay backdrop-blur-modal"
            />
            <div className="@container relative z-modal w-full max-w-sm rounded-modal border border-border bg-bg-surface p-6 shadow-modal animate-scale-in">
                <div className="flex flex-col items-center text-center gap-4">
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-danger-subtle text-danger">
                        <span className="material-symbols-outlined text-2xl">warning</span>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold font-heading text-text-base">
                            Remove this card?
                        </h3>
                        <p className="text-sm text-text-muted mt-2">
                            This payment method will be permanently removed from your account. You cannot undo this action.
                        </p>
                    </div>

                    <div className="mt-2 flex w-full flex-col gap-3 @sm:flex-row">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isDeleting}
                            className="flex-1 rounded-button border border-border bg-bg-surface px-4 py-2 font-semibold text-text-base transition-colors hover:bg-bg-hover disabled:opacity-disabled"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={isDeleting}
                            className={cn(
                                "flex flex-1 items-center justify-center gap-2 rounded-button bg-danger px-4 py-2 font-semibold text-on-danger shadow-button transition-all duration-normal",
                                "hover:bg-danger-dark hover:shadow-button-hover",
                                "disabled:opacity-disabled disabled:cursor-not-allowed"
                            )}
                        >
                            {isDeleting ? (
                                <>
                                    <span className="animate-spin h-3.5 w-3.5 border-2 border-current border-t-transparent rounded-full" />
                                    Removing...
                                </>
                            ) : (
                                'Remove'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
