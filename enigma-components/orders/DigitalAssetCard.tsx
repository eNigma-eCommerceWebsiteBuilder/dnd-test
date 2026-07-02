'use client';

import { useState } from 'react';
import type { DigitalAsset } from '@/lib/api/types';
import { useDigitalDownload, useToast } from '@/lib/hooks';
import { cn } from '@/lib/utils/cn';
import { formatDownloadCount } from '@/lib/utils/digital-products';

interface DigitalAssetCardProps {
    asset: DigitalAsset;
    isPaid: boolean;
    className?: string;
}

export function DigitalAssetCard({ asset, isPaid, className }: DigitalAssetCardProps) {
    const { download, downloading } = useDigitalDownload();
    const { error } = useToast();
    const [isDownloadingThis, setIsDownloadingThis] = useState(false);

    const handleDownload = async () => {
        if (downloading || !isPaid) return;

        setIsDownloadingThis(true);
        try {
            await download(asset.licenseKey);
        } catch (err) {
            console.error(err);
            error("Failed to initiate download. Please try again.", {
                title: 'Download Failed'
            });
        } finally {
            setIsDownloadingThis(false);
        }
    };

    return (
        <div
            className={cn(
                "@container flex flex-col items-start gap-4 rounded-card border border-border bg-bg-surface p-4 shadow-card transition-all hover:shadow-card-hover @md:flex-row @md:items-center @md:p-6",
                className
            )}
        >
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-image bg-primary/10 text-primary @md:h-16 @md:w-16">
                <span className="material-symbols-outlined text-2xl @md:text-3xl">folder_zip</span>
            </div>

            <div className="min-w-0 flex-1">
                <h3 className="mb-1 truncate text-base font-bold text-text-base @md:text-lg">
                    {asset.productName}
                </h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-muted">
                    <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">download</span>
                        {formatDownloadCount({ downloadCount: asset.downloadCount })}
                    </span>
                    {asset.maxDownloads ? (
                        <span>Limit: {asset.maxDownloads} downloads</span>
                    ) : null}
                </div>
            </div>

            <button
                type="button"
                onClick={handleDownload}
                disabled={!isPaid || downloading}
                className={cn(
                    "flex w-full items-center justify-center gap-2 rounded-button px-6 py-3 text-sm font-semibold shadow-button transition-all duration-normal @md:w-auto",
                    isPaid
                        ? "bg-cta-primary text-on-primary hover:bg-cta-primary-hover hover:shadow-button-hover"
                        : "cursor-not-allowed border border-border bg-bg-disabled text-text-disabled",
                    "disabled:opacity-disabled"
                )}
            >
                {isDownloadingThis ? (
                    <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Downloading...
                    </>
                ) : (
                    <>
                        <span className="material-symbols-outlined text-lg">
                            {isPaid ? 'download' : 'lock'}
                        </span>
                        {isPaid ? 'Download File' : 'Payment Pending'}
                    </>
                )}
            </button>
        </div>
    );
}
