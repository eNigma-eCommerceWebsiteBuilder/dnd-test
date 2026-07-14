import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { fetchCollections } from '@/lib/api/services/collections';

interface CollectionItem {
  name: string;
  slug: string;
  image: string;
  itemCount: number;
  href: string;
}

interface CollectionGridViewProps {
  items: CollectionItem[];
  className?: string;
}

export const puckComponentName = 'CollectionGrid';
export const puckLabel = 'Collection Grid';
export const puckCategory = 'Collections';

export const puckFields = {
  items: {
    type: 'array' as const,
    label: 'Collections',
    arrayFields: {
      name: { type: 'text' as const, label: 'Name' },
      slug: { type: 'text' as const, label: 'Slug' },
      image: { type: 'text' as const, label: 'Image URL' },
      itemCount: { type: 'number' as const, label: 'Item Count' },
      href: { type: 'text' as const, label: 'Link URL' },
    },
    defaultItemProps: {
      name: 'New Collection',
      slug: 'new-collection',
      image: '',
      itemCount: 0,
      href: '/collections/new-collection',
    },
    getItemSummary: (item: CollectionItem) => item.name,
    max: 24,
  },
};

export const puckDefaults = {
  items: [
    { name: 'Winter Essentials', slug: 'winter-essentials', image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&q=80', itemCount: 24, href: '/collections/winter-essentials' },
    { name: 'Summer Collection', slug: 'summer-collection', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3779?w=600&q=80', itemCount: 18, href: '/collections/summer-collection' },
    { name: 'Heritage Line', slug: 'heritage-line', image: 'https://images.unsplash.com/photo-1611923134139-cb5f6c7c5e3e?w=600&q=80', itemCount: 12, href: '/collections/heritage-line' },
  ],
};

export async function puckDataFetcher() {
  const collections = await fetchCollections();
  return {
    items: collections.map((c) => {
      const slug = c.slug || '';
      const isCurated = c.type === 'curated';
      const image = isCurated
        ? (c as any).mainProduct?.images?.[0] || ''
        : (c as any).mainImage?.imageUrl || '';
      const itemCount = isCurated
        ? (c as any).relatedProducts?.length || 0
        : (c as any).products?.length || 0;
      return {
        name: c.name || (c as any).title || slug,
        slug,
        image,
        itemCount,
        href: "/collections/" + slug,
      };
    }),
  };
}

export function CollectionGridView({ items, className }: CollectionGridViewProps) {
  return (
    <div className={cn('@container grid grid-cols-1 gap-8 @md:grid-cols-2 @lg:grid-cols-3', className)}>
      {items.map((item, index) => {
        const cardContent = (
          <>
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-card bg-bg-skeleton">
              {item.image ? (
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url('${item.image}')` }}
                  role="img"
                  aria-label={item.name}
                />
              ) : null}
              <div className="absolute inset-0 bg-primary/0 transition-colors duration-300 group-hover:bg-primary/10" />
            </div>
            <div className="mt-4 flex items-end justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-text-base transition-colors group-hover:text-primary">
                  {item.name}
                </h3>
                <p className="mt-1 text-sm text-text-muted">
                  {item.itemCount.toLocaleString()} Items
                </p>
              </div>
              <span className="material-symbols-outlined text-text-lighter transition-colors group-hover:text-primary">
                arrow_right_alt
              </span>
            </div>
          </>
        );

        if (item.href) {
          return (
            <Link key={index} href={item.href} className="@container group block w-full">
              {cardContent}
            </Link>
          );
        }

        return (
          <div key={index} className="@container group w-full">
            {cardContent}
          </div>
        );
      })}
    </div>
  );
}
