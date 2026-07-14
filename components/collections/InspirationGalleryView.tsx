import { cn } from '@/lib/utils/cn';
import { fetchInspirationCollection } from '@/lib/api/services/collections';

interface SideImageItem {
  name: string;
  image: string;
}

interface InspirationGalleryViewProps {
  title: string;
  subtitle?: string;
  mainImage: string;
  mainImageAlt?: string;
  sideImages: SideImageItem[];
  className?: string;
}

export const puckComponentName = 'InspirationGallery';
export const puckLabel = 'Inspiration Gallery';
export const puckCategory = 'Collections';

export const puckFields = {
  title: { type: 'text' as const, label: 'Title' },
  subtitle: { type: 'textarea' as const, label: 'Subtitle' },
  mainImage: { type: 'text' as const, label: 'Main Image URL' },
  mainImageAlt: { type: 'text' as const, label: 'Main Image Alt Text' },
  sideImages: {
    type: 'array' as const,
    label: 'Side Images',
    arrayFields: {
      name: { type: 'text' as const, label: 'Name' },
      image: { type: 'text' as const, label: 'Image URL' },
    },
    defaultItemProps: {
      name: 'New Image',
      image: '',
    },
    getItemSummary: (item: SideImageItem) => item.name,
    max: 2,
  },
};

export const puckDefaults = {
  title: 'Inspiration Lookbook',
  subtitle: 'Curated visuals to inspire your next look.',
  mainImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80',
  mainImageAlt: 'Inspiration lookbook hero image',
  sideImages: [
    { name: 'Detail Shot', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80' },
    { name: 'Lifestyle Shot', image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80' },
  ],
};

export async function puckDataFetcher() {
  const collection = await fetchInspirationCollection();
  return {
    title: collection.title,
    subtitle: collection.subtitle,
    mainImage: collection.mainImage?.imageUrl || '',
    mainImageAlt: collection.mainImage?.alt || collection.title,
    sideImages: (collection.products || []).slice(0, 2).map((p) => ({
      name: p.name,
      image: p.images?.[0] || '',
    })),
  };
}

export function InspirationGalleryView({
  title,
  subtitle,
  mainImage,
  mainImageAlt,
  sideImages = [],
  className,
}: InspirationGalleryViewProps) {
  const hasMainImage = Boolean(mainImage);
  const hasSideImages = sideImages.length > 0;

  return (
    <section className={cn('@container w-full bg-bg-surface py-20', className)}>
      <div className="mx-auto w-full max-w-[1440px] px-6 @lg:px-12">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-heading font-extrabold uppercase tracking-tight text-heading @md:text-4xl">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-3 text-sm text-text-muted @md:text-base">
              {subtitle}
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
                    backgroundImage: `url('${mainImage}')`,
                  }}
                  role="img"
                  aria-label={mainImageAlt || title}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-sm text-text-muted">No inspiration image available.</p>
                </div>
              )}
            </div>
          </div>
          <div className="@md:col-span-4">
            {hasSideImages ? (
              <div className="grid h-full grid-cols-1 gap-6">
                {sideImages.map((item, index) => (
                  <div
                    key={index}
                    className="relative aspect-[4/3] w-full overflow-hidden rounded-card bg-bg-skeleton"
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: item.image
                          ? `url('${item.image}')`
                          : undefined,
                      }}
                      role="img"
                      aria-label={item.name}
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
