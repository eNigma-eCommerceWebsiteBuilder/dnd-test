'use client';

import { useState } from 'react';
import { useToast } from '@/lib/hooks';
import type { StripeCardFormProps } from './types';
import { addPaymentMethodAction } from '@/lib/actions/payment-method-actions';

/**
 * Stripe Card Form Component (Mock Implementation)
 * 
 * Simulates Stripe Elements form for UI demonstration purposes.
 * Doesn't actually process payments through Stripe but calls the server action.
 */
export function StripeCardForm({ onSuccess, onCancel }: StripeCardFormProps) {
    const { success, error } = useToast();
    const [isPending, setIsPending] = useState(false);

    const [cardName, setCardName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPending(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 800));

            const formData = new FormData();
            formData.append('type', 'card');

            const result = await addPaymentMethodAction(null, formData);

            if (result.success) {
                success(result.message || "Your new payment method has been added successfully.");
                if (onSuccess) onSuccess();
            } else {
                throw new Error(result.error || 'Failed to save card');
            }
        } catch (err) {
            error(err instanceof Error ? err.message : "Failed to save card");
        } finally {
            setIsPending(false);
        }
    };

    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        if (parts.length) {
            return parts.join(' ');
        }
        return v;
    };

    const formatExpiry = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            return v.substring(0, 2) + '/' + v.substring(2, 4);
        }
        return v;
    };

    return (
        <form onSubmit={handleSubmit} className="@container space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="cardName" className="text-sm font-semibold text-text-base">
                        Cardholder Name
                    </label>
                    <input
                        id="cardName"
                        type="text"
                        required
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full h-11 px-4 rounded-input border border-input-border bg-input-bg text-text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-text-muted/50"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="cardNumber" className="text-sm font-semibold text-text-base">
                        Card Number
                    </label>
                    <div className="relative">
                        <input
                            id="cardNumber"
                            type="text"
                            required
                            maxLength={19}
                            value={cardNumber}
                            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                            placeholder="0000 0000 0000 0000"
                            className="w-full h-11 px-4 pl-12 rounded-input border border-input-border bg-input-bg text-text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-text-muted/50 font-mono"
                        />
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                            credit_card
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="expiry" className="text-sm font-semibold text-text-base">
                            Expiry Date
                        </label>
                        <input
                            id="expiry"
                            type="text"
                            required
                            maxLength={5}
                            value={expiry}
                            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                            placeholder="MM/YY"
                            className="w-full h-11 px-4 rounded-input border border-input-border bg-input-bg text-text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-text-muted/50 text-center font-mono"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="cvc" className="text-sm font-semibold text-text-base">
                            CVC
                        </label>
                        <div className="relative">
                            <input
                                id="cvc"
                                type="text"
                                required
                                maxLength={4}
                                value={cvc}
                                onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))}
                                placeholder="123"
                                className="w-full h-11 px-4 rounded-input border border-input-border bg-input-bg text-text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-text-muted/50 text-center font-mono"
                            />
                            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-text-muted text-lg pointer-events-none">
                                lock
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isPending}
                    className="flex-1 rounded-button border border-border bg-bg-surface px-4 py-3 font-semibold text-text-base transition-colors hover:bg-bg-hover disabled:opacity-disabled"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex flex-1 items-center justify-center gap-2 rounded-button bg-cta-primary px-4 py-3 font-semibold text-on-primary shadow-button transition-all duration-normal hover:bg-cta-primary-hover hover:shadow-button-hover disabled:opacity-disabled"
                >
                    {isPending ? (
                        <>
                            <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                            Processing...
                        </>
                    ) : (
                        'Save Card'
                    )}
                </button>
            </div>

            <p className="mt-4 flex items-center justify-center gap-1 text-center text-xs text-text-muted">
                <span className="material-symbols-outlined text-sm">lock</span>
                Payments are securely processed by Stripe
            </p>
        </form>
    );
}
