'use client';

import { DigitalAsset } from '@/lib/api/types';
import { DigitalAssetCard } from './DigitalAssetCard';
import { cn } from '@/lib/utils/cn';

interface OrderDigitalDownloadsProps {
    assets: DigitalAsset[];
    isPaid: boolean;
    className?: string;
}

/**
 * OrderDigitalDownloads Component
 * 
 * Container for list of digital asset cards.
 */
export function OrderDigitalDownloads({ assets, isPaid, className }: OrderDigitalDownloadsProps) {
    if (!assets || assets.length === 0) return null;

    return (
        <div className={cn("@container space-y-4", className)}>
            {assets.map((asset, idx) => (
                <DigitalAssetCard
                    key={asset.licenseKey || idx}
                    asset={asset}
                    isPaid={isPaid}
                />
            ))}
        </div>
    );
}
