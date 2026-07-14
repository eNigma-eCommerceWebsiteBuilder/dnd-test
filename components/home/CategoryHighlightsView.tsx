import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { fetchTrendingCategories } from '@/lib/api/services/categories';

interface CategoryItem {
  name: string;
  slug: string;
  image: string;
  productCount: number;
}

interface CategoryHighlightsViewProps {
  header: string;
  subheader: string;
  ctaLabel: string;
  categories: CategoryItem[];
  className?: string;
}

export const puckComponentName = 'CategoryHighlights';
export const puckLabel = 'Category Highlights';
export const puckCategory = 'Home';

export const puckFields = {
  header: { type: 'text' as const, label: 'Header' },
  subheader: { type: 'text' as const, label: 'Subheader' },
  ctaLabel: { type: 'text' as const, label: 'CTA Label' },
  categories: {
    type: 'array' as const,
    label: 'Categories',
    arrayFields: {
      name: { type: 'text' as const, label: 'Name' },
      slug: { type: 'text' as const, label: 'Slug' },
      image: { type: 'text' as const, label: 'Image URL' },
      productCount: { type: 'number' as const, label: 'Product Count' },
    },
    defaultItemProps: {
      name: 'New Category',
      slug: 'new-category',
      image: '',
      productCount: 0,
    },
    getItemSummary: (item: CategoryItem) => item.name,
  },
};

export const puckDefaults = {
  header: 'Shop by Category',
  subheader: 'Curation',
  ctaLabel: 'Explore All',
  categories: [
    {
      name: 'Outerwear',
      slug: 'outerwear',
      image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&q=80',
      productCount: 42,
    },
    {
      name: 'Footwear',
      slug: 'footwear',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3779?w=600&q=80',
      productCount: 28,
    },
    {
      name: 'Accessories',
      slug: 'accessories',
      image: 'https://images.unsplash.com/photo-1611923134139-8cb8c9e1f1c1?w=600&q=80',
      productCount: 15,
    },
  ],
};

export async function puckDataFetcher() {
  const categories = await fetchTrendingCategories();
  return {
    categories: categories.slice(0, 3).map((c) => ({
      name: c.name,
      slug: c.slug,
      image: c.image ?? c.imageUrl ?? '',
      productCount: c.productCount ?? c.itemCount ?? 0,
    })),
  };
}

export function CategoryHighlightsView({
  header,
  subheader,
  ctaLabel,
  categories,
  className,
}: CategoryHighlightsViewProps) {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className={cn('@container', className)}>
      <div className="mb-12 flex items-end justify-between gap-6">
        <div className="min-w-0">
          <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-primary">
            {subheader}
          </span>
          <h2 className="text-3xl font-extrabold text-text-base @lg:text-4xl">
            {header}
          </h2>
        </div>
        <Link
          href="/collections/all"
          className="shrink-0 border-b-2 border-primary pb-1 text-sm font-bold text-text-base transition-all hover:text-primary"
        >
          {ctaLabel}
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6 @md:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/collections/${category.slug}`}
            className="group relative flex min-h-[320px] items-end overflow-hidden rounded-card bg-bg-skeleton @lg:min-h-[400px]"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
              style={{
                backgroundImage: `url(${category.image || '/placeholder-category.jpg'})`,
              }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,22,22,0.12)_0%,rgba(18,22,22,0.72)_100%)] transition-opacity duration-300 group-hover:opacity-90" />
            <div className="relative z-10 flex w-full flex-col gap-2 p-6 text-on-primary">
              <h3 className="text-3xl font-bold">{category.name}</h3>
              <p className="text-sm text-on-primary/80">
                {category.productCount || 0} Products
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
