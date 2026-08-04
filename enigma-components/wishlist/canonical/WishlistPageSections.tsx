import type { ReactNode } from 'react';
import type { Wishlist } from '@/lib/api/types/wishlist';
import { WishlistEmpty } from '@/enigma-components/wishlist/WishlistEmpty';
import { WishlistGrid } from '@/enigma-components/wishlist/WishlistGrid';
import { WishlistSavingsCard } from '@/enigma-components/wishlist/WishlistSavingsCard';

export function AccountWishlistPageLayout({
  header,
  content,
  recommendations,
}: {
  header?: ReactNode;
  content?: ReactNode;
  recommendations?: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-bg-base text-text-base">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-8 md:py-12">
        {header}
        {content}
        {recommendations}
      </div>
    </main>
  );
}

export function WishlistPageHeaderLayout({
  intro,
  savings,
}: {
  intro?: ReactNode;
  savings?: ReactNode;
}) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
      {intro}
      {savings}
    </div>
  );
}

export function WishlistPageIntro({ wishlistCount }: { wishlistCount: number }) {
  return (
    <div className="w-full lg:w-1/2">
      <h1 className="text-3xl md:text-4xl font-heading font-bold">
        My Wishlist
      </h1>
      <p className="text-text-muted text-sm md:text-base mt-1">
        {wishlistCount} curated pieces waiting for you
      </p>
    </div>
  );
}

export function WishlistSavingsRegion({ wishlist }: { wishlist: Wishlist }) {
  return (
    <div className="w-full lg:w-1/2">
      <WishlistSavingsCard wishlist={wishlist} />
    </div>
  );
}

export function WishlistItemsState({
  hasItems,
  empty,
  grid,
}: {
  hasItems: boolean;
  empty?: ReactNode;
  grid?: ReactNode;
}) {
  return hasItems ? grid : empty;
}

export function WishlistGridRegion({ wishlist }: { wishlist: Wishlist }) {
  return <WishlistGrid wishlist={wishlist} />;
}

export function WishlistEmptyRegion() {
  return <WishlistEmpty />;
}

export function WishlistRecommendationsFooter() {
  return (
    <div className="mt-12 border-t border-divider pt-10 text-center">
      <h2 className="text-2xl font-bold text-text-base mb-3">
        Curated for your style
      </h2>
      <p className="text-text-muted max-w-xl mx-auto mb-6">
        Discover pieces that complement your wishlist items.
      </p>
      <button className="bg-cta-primary hover:bg-cta-primary-hover text-on-primary px-8 py-3 rounded-button font-semibold transition-colors">
        Explore Recommended Collection
      </button>
    </div>
  );
}
