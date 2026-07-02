'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { AddCardButtonProps, StripeConfig } from './types';
import { StripeCardForm } from './StripeCardForm';

const FALLBACK_STRIPE_CONFIG: StripeConfig = {
    publishableKey: 'pk_test_mock',
    mode: 'test'
};

export function AddCardButton({ className, stripeConfig }: AddCardButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className={cn(
                    "@container inline-flex items-center gap-2 rounded-button bg-cta-primary px-4 py-2 text-sm font-semibold text-on-primary shadow-button transition-all duration-normal hover:-translate-y-0.5 hover:bg-cta-primary-hover hover:shadow-button-hover",
                    className
                )}
            >
                <span className="material-symbols-outlined text-xl">add_card</span>
                Add New Card
            </button>

            {isOpen && (
                <div className="@container fixed inset-0 z-modal flex items-center justify-center p-4">
                    <button
                        type="button"
                        aria-label="Close add card modal"
                        onClick={() => setIsOpen(false)}
                        className="absolute inset-0 z-modal-backdrop bg-bg-overlay opacity-overlay backdrop-blur-modal"
                    />
                    <div className="@container relative z-modal flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-modal border border-border bg-bg-surface shadow-modal animate-scale-in">
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-bg-surface p-4 @md:p-6">
                            <h3 className="text-lg font-bold font-heading text-text-base">Add New Card</h3>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="rounded-full p-2 text-text-muted transition-colors hover:bg-bg-hover hover:text-text-base"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="overflow-y-auto p-4 @md:p-6">
                            <StripeCardForm
                                stripeConfig={stripeConfig ?? FALLBACK_STRIPE_CONFIG}
                                onSuccess={() => setIsOpen(false)}
                                onCancel={() => setIsOpen(false)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
