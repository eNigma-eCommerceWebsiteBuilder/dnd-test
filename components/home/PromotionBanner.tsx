'use client';

import { cn } from '@/lib/utils/cn';
import type { Promotion } from '@/lib/api/types/promotions';
import { getPromotionProgress, isPromotionActive } from '@/lib/utils/promotions';
import { PromotionBannerView } from './PromotionBannerView';

interface PromotionBannerProps {
  className?: string;
  promotion: Promotion | null;
}

export const PromotionBanner = ({ className, promotion }: PromotionBannerProps) => {
  if (!promotion) return null;
  if (!isPromotionActive(promotion)) return null;

  return (
    <PromotionBannerView
      title={promotion.title}
      subtitle={promotion.subtitle}
      ctaText={promotion.ctaText}
      ctaLink={promotion.ctaLink}
      startDate={promotion.startDate}
      endDate={promotion.endDate}
      className={className}
    />
  );
};
