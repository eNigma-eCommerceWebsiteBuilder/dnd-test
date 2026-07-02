'use client';

import { useState } from 'react';
import { useToast } from '@/lib/hooks';
import { maskLicenseKey } from '@/lib/utils/digital-products';
import { cn } from '@/lib/utils/cn';

interface LicenseKeyDisplayProps {
    licenseKey: string;
    productName: string;
    className?: string;
}

/**
 * LicenseKeyDisplay Component
 * 
 * Securely displays license key with copy functionality.
 */
export function LicenseKeyDisplay({ licenseKey, productName, className }: LicenseKeyDisplayProps) {
    const { success, error } = useToast();
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(licenseKey);
            setCopied(true);
            success("License key copied to clipboard", {
                title: 'Copied'
            });

            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
            error("Failed to copy license key", {
                title: 'Error'
            });
        }
    };

    return (
        <div className={cn("@container flex items-center justify-between p-3 bg-bg-sunken rounded-input border border-border-light", className)}>
            <div className="flex flex-col min-w-0 mr-4">
                <span className="text-xs text-text-muted mb-0.5">{productName}</span>
                <span className="font-mono text-sm font-semibold text-text-base truncate">
                    {maskLicenseKey(licenseKey)}
                </span>
            </div>
            <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-button-sm bg-bg-surface border border-border text-xs font-bold text-text-base hover:bg-bg-hover hover:border-border-dark transition-all shadow-sm"
                aria-label="Copy license key"
            >
                {copied ? (
                    <>
                        <span className="material-symbols-outlined text-sm text-success">check</span>
                        Copied
                    </>
                ) : (
                    <>
                        <span className="material-symbols-outlined text-sm">content_copy</span>
                        Copy
                    </>
                )}
            </button>
        </div>
    );
}
