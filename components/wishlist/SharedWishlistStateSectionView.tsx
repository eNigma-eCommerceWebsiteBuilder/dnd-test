import { viewSharedWishlist } from '@/lib/api/services/wishlist';
import type { WishlistItem } from '@/lib/api/types/wishlist';
import { formatPrice } from '@/lib/utils/formatters/price';
import {
  getRouteParam,
  getSearchParam,
  type PuckFetcherContext,
} from '@/lib/puck-route-metadata';

interface SharedWishlistStateSectionViewProps {
  token?: string;
  state?: string;
  itemCount?: number;
  lastUpdated?: string | null;
  items?: WishlistItem[];
}

export const puckComponentName = 'SharedWishlistStateSection';
export const puckLabel = 'Shared Wishlist State Section';
export const puckCategory = 'Wishlist';

export const puckFields = {
  token: { type: 'text' as const, label: 'Share Token' },
  state: {
    type: 'select' as const,
    label: 'Preview State',
    options: [
      { label: 'Items', value: 'items' },
      { label: 'Empty', value: 'empty' },
      { label: 'Invalid', value: 'invalid' },
    ],
  },
  itemCount: { type: 'number' as const, label: 'Item Count' },
  lastUpdated: { type: 'text' as const, label: 'Last Updated' },
};

export const puckDefaults = {
  token: '',
  state: 'invalid',
  itemCount: 0,
  lastUpdated: null,
};

export const puckAst = {
  kind: 'runtime',
  topLevel: true,
  runtimeSignals: ['params.token', 'wishlist', 'wishlist.items'],
  matches: [
    { pageIncludes: ['app/wishlist/shared/[token]/page.tsx'], component: 'SharedWishlistStateSection' },
  ],
};

export async function puckDataFetcher(
  props: { token?: string },
  context?: PuckFetcherContext,
) {
  const token = props.token
    || getRouteParam(context, 'token')
    || getSearchParam(context, 'token');

  if (!token) return { state: 'invalid', itemCount: 0, items: [] };

  try {
    const wishlist = await viewSharedWishlist(token);
    const items = wishlist.items ?? [];
    return {
      token,
      state: items.length > 0 ? 'items' : 'empty',
      itemCount: wishlist.totalItems ?? items.length,
      lastUpdated: wishlist.lastUpdated,
      items,
    };
  } catch {
    return { state: 'invalid', itemCount: 0, items: [] };
  }
}

export function SharedWishlistStateSectionView({
  state = 'invalid',
  itemCount = 0,
  lastUpdated = null,
  items = [],
}: SharedWishlistStateSectionViewProps) {
  if (state === 'invalid') {
    return (
      <main className="min-h-screen w-full bg-bg-base text-text-base">
        <section className="mx-auto w-full max-w-[1440px] px-6 py-16 lg:px-12">
          <div className="rounded-card border border-border bg-bg-surface p-8 text-center">
            <h1 className="text-2xl font-heading font-bold text-heading">Shared wishlist not found</h1>
            <p className="mt-3 text-text-muted">The share link is invalid or no longer available.</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-bg-base text-text-base">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-12 lg:px-12">
        <section className="@container w-full border-b border-border pb-10">
          <div className="flex flex-col gap-6 @md:flex-row @md:items-end @md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-sm text-text-muted">
                <span className="rounded-badge bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                  Public List
                </span>
                <span>{itemCount} items</span>
                {lastUpdated ? <span>Updated {new Date(lastUpdated).toLocaleDateString()}</span> : null}
              </div>
              <h1 className="mt-4 text-3xl font-heading font-bold text-heading @md:text-4xl">
                Shared Wishlist
              </h1>
            </div>
          </div>
        </section>

        <div className="mt-10">
          {state === 'empty' ? (
            <div className="rounded-card border border-border bg-bg-surface p-8 text-center">
              <h2 className="text-xl font-heading font-bold text-heading">No items yet</h2>
              <p className="mt-2 text-text-muted">This shared wishlist is currently empty.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 @md:grid-cols-2 @lg:grid-cols-4">
              {items.map((item) => (
                <WishlistCard key={item._id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function WishlistCard({ item }: { item: WishlistItem }) {
  const product = item.product;
  const snapshot = item.productSnapshot;
  const name = product?.name || snapshot?.name || 'Wishlist item';
  const image = product?.imageUrl || product?.images?.[0] || snapshot?.image;
  const price = product?.salePrice || product?.price || snapshot?.price || item.priceWhenAdded;

  return (
    <article className="overflow-hidden rounded-card border border-border bg-bg-surface shadow-card">
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt={name} className="aspect-square w-full object-cover" />
      ) : (
        <div className="aspect-square w-full bg-bg-base" />
      )}
      <div className="space-y-2 p-4">
        <h2 className="line-clamp-2 text-sm font-semibold text-text-base">{name}</h2>
        <p className="text-sm font-bold text-primary">{formatPrice(price)}</p>
      </div>
    </article>
  );
}
