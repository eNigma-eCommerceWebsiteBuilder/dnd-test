'use client';

import Link from 'next/link';

import { cn } from '@/lib/utils/cn';
import type { Promotion } from '@/lib/api/types/promotions';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { UrgencyBadge } from '@/components/promotions/UrgencyBadge';
import { getPromotionProgress, isPromotionActive } from '@/lib/utils/promotions';

interface PromotionBannerProps {
    className?: string;
    promotion: Promotion | null;
}

export const PromotionBanner = ({ className, promotion }: PromotionBannerProps) => {
    if (!promotion) return null;
    if (!isPromotionActive(promotion)) return null;

    const showProgress = Boolean(promotion.startDate && promotion.endDate);
    const progress = showProgress ? getPromotionProgress(promotion) : 0;
    const hasCta = Boolean(promotion.ctaText && promotion.ctaLink);

    return (
        <div className={cn("@container w-full bg-bg-surface text-text-base border-b border-border", className)}>
            <div className="w-full px-4 py-3 flex flex-col @md:flex-row @md:items-center @md:justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <UrgencyBadge promotion={promotion} />
                        <span className="text-sm font-semibold text-text-base">{promotion.title}</span>
                    </div>
                    <span className="text-xs text-text-muted">{promotion.subtitle}</span>
                </div>

                <div className="flex flex-col @md:flex-row @md:items-center gap-3 @md:gap-4">
                    {promotion.endDate && (
                        <CountdownTimer targetDate={promotion.endDate} className="text-text-base" />
                    )}
                    {hasCta && (
                        <Link
                            href={promotion.ctaLink}
                            className="inline-flex items-center justify-center rounded-button bg-cta-primary px-4 py-2 text-xs font-semibold text-on-primary transition-colors duration-normal hover:bg-cta-primary-hover"
                        >
                            {promotion.ctaText}
                        </Link>
                    )}
                </div>
            </div>

            {showProgress && (
                <div className="h-1 w-full bg-bg-sunken">
                    <div className="h-full bg-primary transition-all duration-normal" style={{ width: `${progress}%` }} />
                </div>
            )}
        </div>
    );
};
