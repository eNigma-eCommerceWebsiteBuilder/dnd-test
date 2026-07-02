import Link from 'next/link';

import { cn } from '@/lib/utils/cn';
import type { Promotion } from '@/lib/api/types/promotions';
import { isPromotionActive } from '@/lib/utils/promotions';

interface PromotionBarProps {
    promotion: Promotion | null;
    className?: string;
}

export const PromotionBar = ({ promotion, className }: PromotionBarProps) => {
    if (!promotion) return null;
    if (!isPromotionActive(promotion)) return null;

    const hasCta = Boolean(promotion.ctaText && promotion.ctaLink);

    return (
        <div className={cn("@container w-full bg-bg-surface text-text-base border-b border-border", className)}>
            <div className="w-full px-4 py-3 flex flex-col @md:flex-row @md:items-center @md:justify-between gap-2 @md:gap-4">
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-text-base">{promotion.title}</span>
                    <span className="text-xs text-text-muted">{promotion.subtitle}</span>
                </div>
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
    );
};
