import type { ReactNode } from 'react';
import Link from 'next/link';

interface TrendingCategoriesSectionProps {
  hasTrending: boolean;
  cards: ReactNode;
}

// Owns the source route's topTrending.length > 0 branch and card grid.
export function TrendingCategoriesSection({ hasTrending, cards }: TrendingCategoriesSectionProps) {
  if (!hasTrending) return null;

  return (
    <section className="mb-16">
      <div className="flex items-end justify-between mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-text-base">
          Trending Categories
        </h2>
        <Link
          href="/products?sort=trending"
          className="text-primary font-semibold flex items-center gap-1 group"
        >
          View all trends
          <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards}
      </div>
    </section>
  );
}
