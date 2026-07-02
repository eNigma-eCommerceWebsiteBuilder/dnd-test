'use client';

import { cn } from '@/lib/utils/cn';

interface CancelConfirmModalProps {
    isOpen: boolean;
    isPending?: boolean;
    onConfirm: () => void;
    onClose: () => void;
    className?: string;
}

export function CancelConfirmModal({
    isOpen,
    isPending = false,
    onConfirm,
    onClose,
    className,
}: CancelConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="@container fixed inset-0 z-modal flex items-center justify-center px-4">
            <button
                type="button"
                aria-label="Close cancel return modal"
                onClick={onClose}
                className="absolute inset-0 z-modal-backdrop bg-bg-overlay opacity-overlay backdrop-blur-modal"
            />
            <div
                role="dialog"
                aria-modal="true"
                className={cn(
                    '@container relative z-modal flex w-full max-w-md flex-col gap-4 rounded-modal border border-border bg-bg-surface p-6 shadow-modal',
                    className
                )}
            >
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-danger-subtle">
                        <span className="material-symbols-outlined text-danger">warning</span>
                    </div>
                    <div className="flex flex-col">
                        <h3 className="text-base font-semibold text-text-base">Cancel return?</h3>
                        <p className="text-sm text-text-muted">
                            This action can&apos;t be undone.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-3 @sm:flex-row @sm:justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-button bg-bg-sunken px-4 py-2 font-semibold text-text-base transition-colors hover:bg-bg-hover"
                        disabled={isPending}
                    >
                        Keep return
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="rounded-button bg-danger px-4 py-2 font-semibold text-on-danger transition-colors hover:bg-danger-dark disabled:opacity-disabled"
                        disabled={isPending}
                    >
                        {isPending ? 'Cancelling...' : 'Cancel return'}
                    </button>
                </div>
            </div>
        </div>
    );
}
