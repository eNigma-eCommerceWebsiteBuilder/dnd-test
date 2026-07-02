'use client';

import { useState } from 'react';
import type { DigitalAsset } from '@/lib/api/types';
import { useDigitalDownload, useToast } from '@/lib/hooks';
import { cn } from '@/lib/utils/cn';

interface DigitalDownloadsProps {
    assets: DigitalAsset[];
    className?: string;
}

/**
 * DigitalDownloads Component
 * 
 * Interactive component to download digital assets.
 * 
 * Design Principles:
 * - Client Component ('use client')
 * - Uses useDigitalDownload hook
 * - Toast feedback
 * - Theme styling
 */
export function DigitalDownloads({ assets, className }: DigitalDownloadsProps) {
    const { download, downloading } = useDigitalDownload();
    const { error: toastError } = useToast();
    const [downloadingAssetId, setDownloadingAssetId] = useState<string | null>(null);

    const handleDownload = async (asset: DigitalAsset) => {
        if (downloading) return;

        setDownloadingAssetId(asset.licenseKey);
        try {
            await download(asset.licenseKey);
        } catch (err) {
            console.error(err);
            toastError("Failed to initiate download. Please try again.");
        } finally {
            setDownloadingAssetId(null);
        }
    };

    if (!assets || assets.length === 0) return null;

    return (
        <div className={cn("@container", className)}>
            <div className="rounded-card border border-border bg-bg-surface p-4 shadow-card @md:p-6">
                <div className="mb-4 flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">download</span>
                    <h3 className="font-bold text-text-base">Digital Items & Assets</h3>
                </div>

                <div className="space-y-4">
                    {assets.map((asset, idx) => (
                        <div key={asset.licenseKey || idx} className="border-b border-divider pb-4 last:border-0 last:pb-0">
                            <div className="mb-2 flex flex-col justify-between gap-3 @md:flex-row @md:items-center">
                                <span className="font-semibold text-text-base">{asset.productName}</span>
                                <button
                                    type="button"
                                    onClick={() => handleDownload(asset)}
                                    disabled={downloading}
                                    className={cn(
                                        "inline-flex items-center justify-center gap-2 rounded-button-sm bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-colors",
                                        "hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-disabled"
                                    )}
                                >
                                    {downloading && downloadingAssetId === asset.licenseKey ? (
                                        <>
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                            Downloading...
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                                            Download File
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="flex gap-4 text-xs text-text-muted">
                                <span>License: End User</span>
                                {asset.downloadCount > 0 && (
                                    <span>Downloaded {asset.downloadCount} times</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
