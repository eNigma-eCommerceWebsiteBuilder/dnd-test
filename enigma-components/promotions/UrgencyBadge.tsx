'use client';

import { cn } from '@/lib/utils/cn';
import type { Promotion } from '@/lib/api/types/promotions';
import { getPromotionUrgency, isPromotionExpiringSoon } from '@/lib/utils/promotions';

interface UrgencyBadgeProps {
    promotion: Promotion | null;
    className?: string;
}

const urgencyClassMap: Record<
    ReturnType<typeof getPromotionUrgency>,
    { badge: string; text: string }
> = {
    none: { badge: '', text: '' },
    low: { badge: 'bg-info-subtle', text: 'text-info' },
    medium: { badge: 'bg-warning-subtle', text: 'text-warning' },
    high: { badge: 'bg-warning-subtle', text: 'text-warning' },
    critical: { badge: 'bg-danger-subtle', text: 'text-danger' },
};

export const UrgencyBadge = ({ promotion, className }: UrgencyBadgeProps) => {
    if (!promotion) return null;

    const urgency = getPromotionUrgency(promotion);
    const isSoon = isPromotionExpiringSoon(promotion);

    if (urgency === 'none' || !isSoon) return null;

    const styles = urgencyClassMap[urgency];

    return (
        <span
            className={cn(
                "@container inline-flex items-center rounded-badge px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest",
                styles.badge,
                styles.text,
                className
            )}
        >
            Ends soon
        </span>
    );
};
