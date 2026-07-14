import type { Category } from '@/lib/api/types';
import type { CategoryHighlightsContent } from '@/lib/content';
import { CategoryHighlightsView } from './CategoryHighlightsView';

interface CategoryHighlightsProps {
  categories: Category[];
  className?: string;
  content: CategoryHighlightsContent;
}

export const CategoryHighlights = ({
  categories,
  className,
  content,
}: CategoryHighlightsProps) => {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <CategoryHighlightsView
      header={content.header}
      subheader={content.subheader}
      ctaLabel={content.ctaLabel}
      categories={categories.map((c) => ({
        name: c.name,
        slug: c.slug,
        image: c.image || c.imageUrl || '',
        productCount: c.productCount || c.itemCount || 0,
      }))}
      className={className}
    />
  );
};
