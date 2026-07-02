'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';

interface BillingTermsProps {
    defaultChecked?: boolean;
    checked?: boolean;
    termsText?: string;
    policyText?: string;
    onChange?: (checked: boolean) => void;
    className?: string;
}

export default function BillingTerms({
    defaultChecked = false,
    checked,
    termsText = 'I agree to the subscription terms and recurring billing.',
    policyText = 'Cancellation policy details will be shared before payment.',
    onChange,
    className,
}: BillingTermsProps) {
    const [internalChecked, setInternalChecked] = useState(defaultChecked);
    const isChecked = typeof checked === 'boolean' ? checked : internalChecked;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const nextValue = event.target.checked;
        setInternalChecked(nextValue);
        if (onChange) {
            onChange(nextValue);
        }
    };

    return (
        <div className={cn('@container w-full space-y-3', className)}>
            <label className="flex items-start gap-3 text-sm text-text-muted leading-relaxed">
                <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleChange}
                    className="mt-1 h-5 w-5 rounded border border-input-border text-primary focus:ring-2 focus:ring-primary/20"
                />
                <span>{termsText}</span>
            </label>
            <p className="text-xs text-text-muted italic">{policyText}</p>
        </div>
    );
}
