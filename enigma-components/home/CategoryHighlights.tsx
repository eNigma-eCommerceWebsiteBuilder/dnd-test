import Link from 'next/link';
import type { Category } from '@/lib/api/types';
import type { CategoryHighlightsContent } from '@/lib/content';
import { cn } from '@/lib/utils/cn';

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
    <section className={cn('@container', className)}>
      <div className="mb-12 flex items-end justify-between gap-6">
        <div className="min-w-0">
          <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-primary">
            {content.subheader}
          </span>
          <h2 className="text-3xl font-extrabold text-text-base @lg:text-4xl">
            {content.header}
          </h2>
        </div>
        <Link
          href="/collections/all"
          className="shrink-0 border-b-2 border-primary pb-1 text-sm font-bold text-text-base transition-all hover:text-primary"
        >
          {content.ctaLabel}
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6 @md:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category._id}
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
};
