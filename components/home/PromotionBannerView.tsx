import type { Promotion } from '@/lib/api/types/promotions';
import { fetchCurrentPromotion } from '@/lib/api/services/promotions';
import { PromotionBanner } from '@/enigma-components/home/PromotionBanner';

interface PromotionBannerViewProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  startDate: string;
  endDate: string;
  className?: string;
  runtimePromotion?: Promotion | null;
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
  try {
    return { runtimePromotion: await fetchCurrentPromotion() };
  } catch {
    // This mirrors HomePage's withNull(fetchCurrentPromotion()).
    return { runtimePromotion: null };
  }
}

export function PromotionBannerView({
  title,
  subtitle,
  ctaText,
  ctaLink,
  startDate,
  endDate,
  className,
  runtimePromotion,
}: PromotionBannerViewProps) {
  const seedPromotion: Promotion = {
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

  // Undefined is editor seed mode. Null is the real published no-promotion state.
  return <PromotionBanner promotion={runtimePromotion === undefined ? seedPromotion : runtimePromotion} className={className} />;
}
