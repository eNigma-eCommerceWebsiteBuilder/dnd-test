import { fetchTrendingCategories } from '@/lib/api/services/categories';
import type { Category } from '@/lib/api/types';
import type { CategoryHighlightsContent } from '@/lib/content';
import { CategoryHighlights } from '@/enigma-components/home/CategoryHighlights';

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
  runtimeCategories?: Category[];
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
export const puckAst = { kind: 'runtime', sourceJsxNames: ['CategoryHighlights'], sourceImportPaths: ['@/components/home/CategoryHighlights'], role: 'home-category-highlights', runtimeSignals: ['trendingCategories', 'homepage.categories'] };

export async function puckDataFetcher() {
  try {
    return { runtimeCategories: (await fetchTrendingCategories()).slice(0, 3) };
  } catch {
    // This mirrors HomePage's withFallback(fetchTrendingCategories(), []).
    return { runtimeCategories: [] };
  }
}

export function CategoryHighlightsView({
  header,
  subheader,
  ctaLabel,
  categories = [],
  className,
  runtimeCategories,
}: CategoryHighlightsViewProps) {
  const content = { header, subheader, ctaLabel } as CategoryHighlightsContent;
  const seedCategories = categories.map((category, index) => ({ ...category, _id: category.slug || `category-${index}`, image: category.image }) as Category);
  const sourceCategories = runtimeCategories === undefined ? seedCategories : runtimeCategories;
  return <CategoryHighlights content={content} categories={sourceCategories} className={className} />;
}
