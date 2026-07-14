import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import type { Promotion } from '@/lib/api/types/promotions';
import { fetchCurrentPromotion } from '@/lib/api/services/promotions';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { UrgencyBadge } from '@/components/promotions/UrgencyBadge';

interface PromotionBannerViewProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  startDate: string;
  endDate: string;
  className?: string;
}

export const puckComponentName = 'PromotionBanner';
export const puckLabel = 'Promotion Banner';
export const puckCategory = 'Marketing';

export const puckFields = {
  title: { type: 'text' as const, label: 'Title' },
  subtitle: { type: 'text' as const, label: 'Subtitle' },
  ctaText: { type: 'text' as const, label: 'CTA Text' },
  ctaLink: { type: 'text' as const, label: 'CTA Link' },
  startDate: { type: 'text' as const, label: 'Start Date (ISO)' },
  endDate: { type: 'text' as const, label: 'End Date (ISO)' },
};

export const puckDefaults = {
  title: 'Free Shipping on All Orders',
  subtitle: 'Limited time only — ends soon',
  ctaText: 'Shop Now',
  ctaLink: '/collections/all',
  startDate: '2020-01-01T00:00:00Z',
  endDate: '2099-12-31T23:59:59Z',
};
export const puckAst = { kind: 'runtime', sourceJsxNames: ['PromotionBanner'], sourceImportPaths: ['@/components/home/PromotionBanner'], role: 'promotion-banner', runtimeSignals: ['promotion'] };

export async function puckDataFetcher() {
  const promo = await fetchCurrentPromotion();
  if (!promo) return {};
  return {
    title: promo.title,
    subtitle: promo.subtitle,
    ctaText: promo.ctaText,
    ctaLink: promo.ctaLink,
    startDate: promo.startDate,
    endDate: promo.endDate,
  };
}

export function PromotionBannerView({
  title,
  subtitle,
  ctaText,
  ctaLink,
  startDate,
  endDate,
  className,
}: PromotionBannerViewProps) {
  const showProgress = Boolean(startDate && endDate);
  const hasCta = Boolean(ctaText && ctaLink);

  const progress = (() => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = Date.now();
    if (end <= start) return 100;
    return Math.min(Math.max((now - start) / (end - start) * 100, 0), 100);
  })();

  const promoForBadge: Promotion = {
    id: 'promo-puck',
    backgroundImage: '',
    title,
    subtitle,
    description: '',
    ctaText,
    ctaLink,
    startDate,
    endDate,
  };

  return (
    <div className={cn('@container w-full bg-bg-surface text-text-base border-b border-border', className)}>
      <div className="w-full px-4 py-3 flex flex-col @md:flex-row @md:items-center @md:justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <UrgencyBadge promotion={promoForBadge} />
            <span className="text-sm font-semibold text-text-base">{title}</span>
          </div>
          <span className="text-xs text-text-muted">{subtitle}</span>
        </div>

        <div className="flex flex-col @md:flex-row @md:items-center gap-3 @md:gap-4">
          {endDate && (
            <CountdownTimer targetDate={endDate} className="text-text-base" />
          )}
          {hasCta && (
            <Link
              href={ctaLink}
              className="inline-flex items-center justify-center rounded-button bg-cta-primary px-4 py-2 text-xs font-semibold text-on-primary transition-colors duration-normal hover:bg-cta-primary-hover"
            >
              {ctaText}
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
}
