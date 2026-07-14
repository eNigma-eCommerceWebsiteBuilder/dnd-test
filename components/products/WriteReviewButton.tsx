'use client';

import { useId, useState } from 'react';
import { cn } from '@/lib/utils/cn';

interface WriteReviewButtonProps {
    productId: string;
    onOpenReviewForm?: () => void;
    className?: string;
}

export function WriteReviewButton({
    productId,
    onOpenReviewForm,
    className
}: WriteReviewButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const titleId = useId();

    const handleClick = () => {
        if (onOpenReviewForm) {
            onOpenReviewForm();
            return;
        }

        setIsOpen(true);
    };

    return (
        <>
            <button
                type="button"
                onClick={handleClick}
                className={cn(
                    "@container w-full rounded-button border-2 border-primary py-4 font-semibold text-primary transition-colors hover:bg-primary/5",
                    className
                )}
            >
                Write a Review
            </button>

            {isOpen && !onOpenReviewForm ? (
                <div className="@container fixed inset-0 z-modal flex items-center justify-center p-4">
                    <button
                        type="button"
                        aria-label="Close review modal"
                        onClick={() => setIsOpen(false)}
                        className="absolute inset-0 bg-bg-overlay"
                    />
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={titleId}
                        className="relative z-modal max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-modal bg-bg-surface p-6 shadow-modal"
                    >
                        <div className="mb-6 flex items-center justify-between">
                            <h3 id={titleId} className="text-xl font-bold text-text-base">
                                Write a Review
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="rounded-full p-1 transition-colors hover:bg-bg-hover"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <p className="mb-4 text-sm text-text-muted">
                            Review form for product {productId} will be implemented here.
                        </p>

                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="flex-1 rounded-button border border-border py-3 font-medium transition-colors hover:bg-bg-hover"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="flex-1 rounded-button bg-cta-primary py-3 font-medium text-on-primary transition-colors hover:bg-cta-primary-hover"
                            >
                                Submit Review
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
}

export default WriteReviewButton;
