'use client';

import { useState } from 'react';
import { useToast } from '@/lib/hooks';
import { cn } from '@/lib/utils/cn';

interface PromoCodeInputProps {
    onApply?: (code: string) => Promise<boolean>;
    className?: string;
}

/**
 * PromoCodeInput Component (Client)
 * 
 * Input field for applying promotional codes.
 * Provides feedback via useToast hook.
 * Uses @container queries for responsive layout.
 * Uses theme variables from tailwind.config.ts
 */
export function PromoCodeInput({ onApply, className }: PromoCodeInputProps) {
    const { success, error: showError } = useToast();
    const [code, setCode] = useState('');
    const [isApplying, setIsApplying] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleApply = async () => {
        if (!code.trim() || !onApply) return;

        setIsApplying(true);
        setStatus('idle');

        try {
            const isSuccess = await onApply(code.trim().toUpperCase());
            setStatus(isSuccess ? 'success' : 'error');

            if (isSuccess) {
                success(`Code "${code.toUpperCase()}" has been applied to your order.`, {
                    title: 'Promo Code Applied'
                });
                setCode('');
            } else {
                showError('Invalid code', {
                    title: 'Invalid Code'
                });
            }
        } catch {
            setStatus('error');
            showError('Failed to apply promo code. Please try again.', {
                title: 'Error'
            });
        } finally {
            setIsApplying(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleApply();
        }
    };

    return (
        <div className={cn("@container", className)}>
            <label className="block text-xs @sm:text-sm font-medium text-text-muted mb-2 @sm:mb-3">
                Promo Code
            </label>
            <div className="flex gap-2 @sm:gap-3">
                <input
                    type="text"
                    value={code}
                    onChange={(e) => {
                        setCode(e.target.value);
                        setStatus('idle');
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter code"
                    className={cn(
                        "flex-1 px-3 @sm:px-4 py-2 @sm:py-3 text-sm bg-input-bg border rounded-input transition-colors",
                        "placeholder:text-input-placeholder focus:outline-none focus:ring-2 focus:ring-primary/20",
                        status === 'success' && "border-border-success",
                        status === 'error' && "border-border-error",
                        status === 'idle' && "border-input-border focus:border-input-border-focus"
                    )}
                    disabled={isApplying}
                />
                <button
                    onClick={handleApply}
                    disabled={!code.trim() || isApplying || !onApply}
                    className={cn(
                        "px-4 @sm:px-6 py-2 @sm:py-3 text-sm font-semibold rounded-button transition-all",
                        "bg-bg-surface border border-border text-text-base",
                        "hover:bg-bg-hover hover:border-border-hover",
                        "disabled:opacity-disabled disabled:cursor-not-allowed"
                    )}
                >
                    {isApplying ? (
                        <span className="material-symbols-outlined animate-spin text-sm @sm:text-base">
                            progress_activity
                        </span>
                    ) : (
                        'Apply'
                    )}
                </button>
            </div>

            {/* Status Message */}
            {status === 'success' && (
                <p className="mt-2 text-xs @sm:text-sm text-success flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    Applied!
                </p>
            )}
            {status === 'error' && (
                <p className="mt-2 text-xs @sm:text-sm text-danger flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">error</span>
                    Invalid code
                </p>
            )}
        </div>
    );
}

export default PromoCodeInput;
