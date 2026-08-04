import type { InspirationCollection } from '@/lib/api/types/collections';
import { cn } from '@/lib/utils/cn';
import { ProductHotspot } from '@/components/collections/ProductHotspot';

interface InspirationGalleryProps {
  collection: InspirationCollection;
  hotspots?: Array<{
    id: string;
    label: string;
    price?: string;
    className: string;
  }>;
  className?: string;
}

/**
 * InspirationGallery Component (Server)
 * Lifestyle image grid with space reserved for hotspots.
 */
export function InspirationGallery({ collection, hotspots = [], className }: InspirationGalleryProps) {
  const hasMainImage = Boolean(collection.mainImage?.imageUrl);
  const sideImages = (collection.products || []).slice(0, 2);
  const hasSideImages = sideImages.length > 0;

  return (
    <section className={cn('@container w-full bg-bg-surface py-20', className)}>
      <div className="mx-auto w-full max-w-[1440px] px-6 @lg:px-12">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-heading font-extrabold uppercase tracking-tight text-heading @md:text-4xl">
            {collection.title}
          </h2>
          {collection.subtitle ? (
            <p className="mt-3 text-sm text-text-muted @md:text-base">
              {collection.subtitle}
            </p>
          ) : null}
        </div>
        <div className="grid grid-cols-1 gap-6 @md:grid-cols-12 @lg:min-h-[800px]">
          <div className="@md:col-span-8">
            <div className="relative h-full min-h-[420px] w-full overflow-hidden rounded-card bg-bg-skeleton">
              {hasMainImage ? (
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url('${collection.mainImage.imageUrl}')`,
                  }}
                  role="img"
                  aria-label={collection.mainImage?.alt || collection.title}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-sm text-text-muted">No inspiration image available.</p>
                </div>
              )}
              {hasMainImage
                ? hotspots.map((hotspot) => (
                    <div key={hotspot.id} className={hotspot.className}>
                      <ProductHotspot label={hotspot.label} price={hotspot.price} />
                    </div>
                  ))
                : null}
            </div>
          </div>
          <div className="@md:col-span-4">
            {hasSideImages ? (
              <div className="grid h-full grid-cols-1 gap-6">
                {sideImages.map((product, index) => (
                  <div
                    key={product._id || product.slug || `${product.name}-${index}`}
                    className="relative aspect-[4/3] w-full overflow-hidden rounded-card bg-bg-skeleton"
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: product.imageUrl
                          ? `url('${product.imageUrl}')`
                          : product.images?.[0]
                            ? `url('${product.images[0]}')`
                            : undefined,
                      }}
                      role="img"
                      aria-label={product.name}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center rounded-card border border-border bg-bg-sunken p-6 text-center">
                <p className="text-sm text-text-muted">No gallery images available.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default InspirationGallery;
