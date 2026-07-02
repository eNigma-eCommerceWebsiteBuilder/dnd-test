'use client';

import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils/cn';
import type { Testimonial } from '@/lib/api/types/testimonials';
import { getTestimonialsByPlatform } from '@/lib/utils/ecommerce';

interface PlatformFilterProps {
    testimonials: Testimonial[];
    activePlatform?: string | null;
    onChange?: (platform: string | null, filtered: Testimonial[]) => void;
    className?: string;
}

/**
 * PlatformFilter Component (Client)
 * Filter testimonials by platform
 */
export function PlatformFilter({ testimonials, activePlatform, onChange, className }: PlatformFilterProps) {
    const [internalPlatform, setInternalPlatform] = useState<string | null>(null);
    const selectedPlatform = activePlatform !== undefined ? activePlatform : internalPlatform;
    const items = useMemo(() => testimonials || [], [testimonials]);

    const platforms = useMemo(() => {
        const set = new Set<string>();
        items.forEach((t) => {
            if (t.platform) set.add(t.platform);
        });
        return Array.from(set.values());
    }, [items]);

    const applyFilter = (platform: string | null) => {
        if (activePlatform === undefined) {
            setInternalPlatform(platform);
        }
        const filtered = platform ? getTestimonialsByPlatform(items, platform) : items;
        onChange?.(platform, filtered);
    };

    if (platforms.length === 0) return null;

    return (
        <div className={cn("@container w-full", className)}>
            <div className="flex flex-wrap gap-2">
                <button
                    type="button"
                    className={cn(
                        "px-4 py-2 rounded-badge border text-xs font-bold transition-colors focus-visible:outline-none focus-visible:shadow-focus-ring",
                        selectedPlatform === null
                            ? 'bg-primary text-on-primary border-primary'
                            : 'bg-bg-surface text-text-muted border-border hover:text-text-base'
                    )}
                    onClick={() => applyFilter(null)}
                    aria-label="Show all platforms"
                    aria-pressed={selectedPlatform === null}
                >
                    All
                </button>
                {platforms.map((platform) => (
                    <button
                        key={platform}
                        type="button"
                        className={cn(
                            "px-4 py-2 rounded-badge border text-xs font-bold transition-colors focus-visible:outline-none focus-visible:shadow-focus-ring",
                            selectedPlatform?.toLowerCase() === platform.toLowerCase()
                                ? 'bg-primary text-on-primary border-primary'
                                : 'bg-bg-surface text-text-muted border-border hover:text-text-base'
                        )}
                        onClick={() => applyFilter(platform)}
                        aria-label={`Filter by ${platform}`}
                        aria-pressed={selectedPlatform?.toLowerCase() === platform.toLowerCase()}
                    >
                        {platform}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default PlatformFilter;
