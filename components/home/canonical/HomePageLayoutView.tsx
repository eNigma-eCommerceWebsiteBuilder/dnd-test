import { HomePageLayout } from './HomePageLayout';
import { puckTransparentSlotProps, type HomeSlot } from './types';

interface HomePageLayoutViewProps {
  promotion?: HomeSlot;
  hero?: HomeSlot;
  categories?: HomeSlot;
  featuredProducts?: HomeSlot;
  curatedCollection?: HomeSlot;
  inspiration?: HomeSlot;
  testimonials?: HomeSlot;
  newsletter?: HomeSlot;
  trustBadges?: HomeSlot;
}

export const puckComponentName = 'HomePageLayout';
export const puckLabel = 'Home Page Layout';
export const puckCategory = 'Home';
export const puckFields = {
  promotion: { type: 'slot' as const, allow: ['PromotionBanner'] },
  hero: { type: 'slot' as const, allow: ['HeroSection'] },
  categories: { type: 'slot' as const, allow: ['CategoryHighlights'] },
  featuredProducts: { type: 'slot' as const, allow: ['FeaturedProductsGrid'] },
  curatedCollection: { type: 'slot' as const, allow: ['CuratedCollectionSection'] },
  inspiration: { type: 'slot' as const, allow: ['InspirationSection'] },
  testimonials: { type: 'slot' as const, allow: ['TestimonialsSection'] },
  newsletter: { type: 'slot' as const, allow: ['NewsletterSignup'] },
  trustBadges: { type: 'slot' as const, allow: ['TrustBadges'] },
};
export const puckDefaults = {
  promotion: [], hero: [], categories: [], featuredProducts: [], curatedCollection: [],
  inspiration: [], testimonials: [], newsletter: [], trustBadges: [],
};
export const puckAst = {
  kind: 'static',
  topLevel: true,
  slots: ['promotion', 'hero', 'categories', 'featuredProducts', 'curatedCollection', 'inspiration', 'testimonials', 'newsletter', 'trustBadges'],
  sourceJsxNames: ['main', 'PromotionBanner', 'HeroSection', 'CategoryHighlights', 'FeaturedProductsGrid', 'CuratedCollectionSection', 'InspirationSection', 'TestimonialsSection', 'NewsletterSignup', 'TrustBadges'],
  sourceImportPaths: ['app/page.tsx'],
  role: 'home-page-layout',
  requiredClasses: ['flex-1', 'max-w-[1440px]', 'mx-auto', 'w-full'],
};

export function HomePageLayoutView({
  promotion,
  hero,
  categories,
  featuredProducts,
  curatedCollection,
  inspiration,
  testimonials,
  newsletter,
  trustBadges,
}: HomePageLayoutViewProps) {
  return (
    <HomePageLayout
      promotion={promotion?.(puckTransparentSlotProps)}
      hero={hero?.(puckTransparentSlotProps)}
      categories={categories?.(puckTransparentSlotProps)}
      featuredProducts={featuredProducts?.(puckTransparentSlotProps)}
      curatedCollection={curatedCollection?.(puckTransparentSlotProps)}
      inspiration={inspiration?.(puckTransparentSlotProps)}
      testimonials={testimonials?.(puckTransparentSlotProps)}
      newsletter={newsletter?.(puckTransparentSlotProps)}
      trustBadges={trustBadges?.(puckTransparentSlotProps)}
    />
  );
}
