import type { WishlistPageData } from './wishlistPageRuntime';
import {
  AccountWishlistPageLayout,
  WishlistEmptyRegion,
  WishlistGridRegion,
  WishlistItemsState,
  WishlistPageHeaderLayout,
  WishlistPageIntro,
  WishlistRecommendationsFooter,
  WishlistSavingsRegion,
} from './WishlistPageSections';

export function WishlistPage({ data }: { data: WishlistPageData }) {
  return (
    <AccountWishlistPageLayout
      header={
        <WishlistPageHeaderLayout
          intro={<WishlistPageIntro wishlistCount={data.wishlistCount} />}
          savings={<WishlistSavingsRegion wishlist={data.wishlist} />}
        />
      }
      content={
        <WishlistItemsState
          hasItems={data.wishlist.items.length > 0}
          empty={<WishlistEmptyRegion />}
          grid={<WishlistGridRegion wishlist={data.wishlist} />}
        />
      }
      recommendations={<WishlistRecommendationsFooter />}
    />
  );
}
