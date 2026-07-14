import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { fetchCuratedCollections } from '@/lib/api/services/collections';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface CollectionHeroViewProps {
  collectionSlug?: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  breadcrumbs: BreadcrumbItem[];
  ctaPrimaryLabel?: string;
  ctaSecondaryLabel?: string;
  className?: string;
}

export const puckComponentName = 'CollectionHero';
export const puckLabel = 'Collection Hero';
export const puckCategory = 'Collections';

export const puckFields = {
  collectionSlug: { type: 'text' as const, label: 'Collection Slug (auto-fill from collection)' },
  title: { type: 'text' as const, label: 'Title' },
  subtitle: { type: 'textarea' as const, label: 'Subtitle' },
  imageUrl: { type: 'text' as const, label: 'Background Image URL' },
  breadcrumbs: {
    type: 'array' as const,
    label: 'Breadcrumbs',
    arrayFields: {
      label: { type: 'text' as const, label: 'Label' },
      href: { type: 'text' as const, label: 'Link URL (optional)' },
    },
    defaultItemProps: {
      label: 'New Crumb',
      href: '',
    },
    getItemSummary: (item: BreadcrumbItem) => item.label,
  },
  ctaPrimaryLabel: { type: 'text' as const, label: 'Primary CTA Label' },
  ctaSecondaryLabel: { type: 'text' as const, label: 'Secondary CTA Label' },
};

export const puckDefaults = {
  collectionSlug: 'winter-essentials',
  title: 'Autumn Collection',
  subtitle: 'A curated selection of timeless pieces for the modern wardrobe.',
  imageUrl: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=1600&q=80',
  breadcrumbs: [
    { label: 'Home', href: '/' },
    { label: 'Collections', href: '/collections' },
    { label: 'Autumn Collection' },
  ],
  ctaPrimaryLabel: 'Shop All Pieces',
  ctaSecondaryLabel: 'Watch Film',
};

export async function puckDataFetcher(props: { collectionSlug?: string }) {
  if (!props.collectionSlug) return {};
  const collections = await fetchCuratedCollections();
  const collection = collections.find((c) => c.slug === props.collectionSlug) || collections[0];
  if (!collection) return {};
  return {
    title: collection.name,
    subtitle: collection.description ?? '',
    imageUrl: collection.mainProduct?.images?.[0] || '',
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Collections', href: '/collections' },
      { label: collection.name },
    ],
  };
}

export function CollectionHeroView({
  title,
  subtitle,
  imageUrl,
  breadcrumbs,
  ctaPrimaryLabel = 'Shop All Pieces',
  ctaSecondaryLabel = 'Watch Film',
  className,
}: CollectionHeroViewProps) {
  return (
    <section className={cn('@container group relative w-full overflow-hidden', className)}>
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
        style={{
          backgroundImage: imageUrl
            ? `linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0.6)), url('${imageUrl}')`
            : undefined,
        }}
        role="img"
        aria-label={title}
      />
      <div className="relative">
        <div className="mx-auto flex min-h-[85vh] w-full max-w-[1440px] flex-col items-center justify-center px-6 py-16 text-center @lg:px-12">
          <nav
            className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-text-inverse opacity-80"
            aria-label="Breadcrumb"
          >
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <div key={index} className="flex items-center gap-2">
                  {item.href && !isLast ? (
                    <Link
                      href={item.href}
                      className="transition-colors hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className={isLast ? 'text-text-base' : ''}>
                      {item.label}
                    </span>
                  )}
                  {!isLast && (
                    <span className="material-symbols-outlined text-sm">
                      chevron_right
                    </span>
                  )}
                </div>
              );
            })}
          </nav>
          <h1 className="text-4xl font-heading font-black tracking-[-0.04em] text-text-inverse @md:text-6xl @lg:text-7xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-4 max-w-2xl text-base font-light leading-relaxed text-text-inverse opacity-90 @md:text-lg">
              {subtitle}
            </p>
          ) : null}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-button bg-cta-primary px-8 py-4 text-sm font-bold tracking-wide text-on-primary shadow-button transition-colors hover:bg-cta-primary-hover"
            >
              {ctaPrimaryLabel}
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-button border border-border-light bg-bg-overlay px-8 py-4 text-sm font-bold tracking-wide text-text-inverse backdrop-blur-nav"
            >
              {ctaSecondaryLabel}
            </button>
          </div>
        </div>
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <span className="material-symbols-outlined text-3xl text-text-inverse">
          expand_more
        </span>
      </div>
    </section>
  );
}
