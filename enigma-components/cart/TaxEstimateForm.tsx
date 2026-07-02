'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { COUNTRIES } from '@/lib/utils';
import type { TaxLocation } from '@/lib/hooks';

interface TaxEstimateFormProps {
    onEstimate: (location: TaxLocation) => Promise<void>;
    className?: string;
}

/**
 * TaxEstimateForm Component (Client)
 * 
 * Form for entering location to estimate taxes.
 * ZIP/country for tax calculation.
 * Uses @container queries for responsive layout.
 * Uses theme variables from tailwind.config.ts
 */
export function TaxEstimateForm({ onEstimate, className }: TaxEstimateFormProps) {
    const [country, setCountry] = useState('US');
    const [state, setState] = useState('');
    const [isCalculating, setIsCalculating] = useState(false);

    const handleCalculate = async () => {
        if (!country) return;

        setIsCalculating(true);
        try {
            await onEstimate({ country, state: state || undefined });
        } finally {
            setIsCalculating(false);
        }
    };

    return (
        <div className={cn("@container", className)}>
            <div className="space-y-2 @sm:space-y-3">
                <div className="flex flex-col @sm:flex-row gap-2">
                    {/* Country Select */}
                    <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        disabled={isCalculating}
                        className={cn(
                            "flex-1 bg-input-bg border border-input-border rounded-input px-3 py-2 @sm:py-2.5 text-sm",
                            "focus:ring-1 focus:ring-primary focus:border-input-border-focus outline-none",
                            "disabled:opacity-disabled"
                        )}
                    >
                        {COUNTRIES.map((c) => (
                            <option key={c.code} value={c.code}>
                                {c.name}
                            </option>
                        ))}
                    </select>

                    {/* State/Province Input */}
                    <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="State/Province"
                        disabled={isCalculating}
                        className={cn(
                            "w-full @sm:w-24 bg-input-bg border border-input-border rounded-input px-3 py-2 @sm:py-2.5 text-sm",
                            "focus:ring-1 focus:ring-primary focus:border-input-border-focus outline-none",
                            "placeholder:text-input-placeholder",
                            "disabled:opacity-disabled"
                        )}
                    />
                </div>

                <button
                    onClick={handleCalculate}
                    disabled={isCalculating || !country}
                    className={cn(
                        "w-full py-2 @sm:py-2.5 text-sm font-medium rounded-button transition-colors",
                        "bg-bg-sunken border border-border text-text-base",
                        "hover:bg-bg-hover hover:border-border-hover",
                        "disabled:opacity-disabled disabled:cursor-not-allowed"
                    )}
                >
                    {isCalculating ? 'Calculating...' : 'Calculate'}
                </button>
            </div>
        </div>
    );
}

export default TaxEstimateForm;
