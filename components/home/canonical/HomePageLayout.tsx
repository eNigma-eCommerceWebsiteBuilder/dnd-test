import type { ReactNode } from 'react';

interface HomePageLayoutProps {
  promotion?: ReactNode;
  hero?: ReactNode;
  categories?: ReactNode;
  featuredProducts?: ReactNode;
  curatedCollection?: ReactNode;
  inspiration?: ReactNode;
  testimonials?: ReactNode;
  newsletter?: ReactNode;
  trustBadges?: ReactNode;
}

// Extracted from eNigma-TemplateFrontend/app/page.tsx. Slots preserve source order.
export function HomePageLayout({
  promotion,
  hero,
  categories,
  featuredProducts,
  curatedCollection,
  inspiration,
  testimonials,
  newsletter,
  trustBadges,
}: HomePageLayoutProps) {
  return (
    <main className="flex-1 max-w-[1440px] mx-auto w-full">
      {promotion}
      {hero}
      {categories}
      {featuredProducts}
      {curatedCollection}
      {inspiration}
      {testimonials}
      {newsletter}
      {trustBadges}
    </main>
  );
}
