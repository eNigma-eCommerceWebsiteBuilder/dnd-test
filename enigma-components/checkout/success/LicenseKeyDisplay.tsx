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
 * 
 * Design Principles:
 * - Client Component for interaction
 * - Masks key by default (handled by util)
 * - Copy to clipboard feedback
 */
export function LicenseKeyDisplay({ licenseKey, productName, className }: LicenseKeyDisplayProps) {
    const { success, error } = useToast();
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(licenseKey);
            setCopied(true);
            success("License key copied to clipboard");

            // Reset copied state after 2 seconds
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
            error("Failed to copy license key");
        }
    };

    return (
        <div className={cn("@container", className)}>
            <div className="mb-3 rounded-card-sm border border-divider bg-bg-sunken p-3 @md:p-4">
                <div className="mb-1 flex items-center justify-between gap-3">
                    <p className="text-xs uppercase tracking-wider text-text-muted">
                        {productName} License
                    </p>
                    <button
                        type="button"
                        onClick={handleCopy}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary transition-colors hover:text-primary-dark"
                        aria-label="Copy license key"
                    >
                        <span className="material-symbols-outlined text-sm">
                            {copied ? 'check' : 'content_copy'}
                        </span>
                        {copied ? 'Copied' : 'Copy'}
                    </button>
                </div>
                <p className="break-all font-mono text-xs font-semibold text-text-base @md:text-sm">
                    {maskLicenseKey(licenseKey)}
                </p>
            </div>
        </div>
    );
}
