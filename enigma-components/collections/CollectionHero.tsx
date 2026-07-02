import { cn } from '@/lib/utils/cn';
import { Breadcrumbs } from '@/components/collections/Breadcrumbs';

interface CollectionHeroProps {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  breadcrumbs: Array<{ label: string; href?: string }>;
  className?: string;
}

/**
 * CollectionHero Component (Server)
 * Hero banner with background image, breadcrumbs, title, and CTA buttons.
 */
export function CollectionHero({
  title,
  subtitle,
  imageUrl,
  breadcrumbs,
  className,
}: CollectionHeroProps) {
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
          <Breadcrumbs items={breadcrumbs} className="mb-6 text-xs font-bold uppercase tracking-[0.3em] text-text-inverse opacity-80" />
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
              Shop All Pieces
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-button border border-border-light bg-bg-overlay px-8 py-4 text-sm font-bold tracking-wide text-text-inverse backdrop-blur-nav"
            >
              Watch Film
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

export default CollectionHero;