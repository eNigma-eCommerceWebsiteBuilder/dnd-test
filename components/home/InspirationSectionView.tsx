import type { CSSProperties } from 'react';
import Link from 'next/link';
import { ProductHotspot } from '@/components/collections/ProductHotspot';
import { cn } from '@/lib/utils/cn';
import { formatPrice } from '@/lib/utils/formatters';
import { fetchInspirationCollection } from '@/lib/api/services/collections';

interface HotspotItem {
  label: string;
  price: number;
  slug: string;
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
}

interface InspirationSectionViewProps {
  subheader: string;
  header: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage: string;
  imageAlt: string;
  hotspots: HotspotItem[];
  className?: string;
}

export const puckComponentName = 'InspirationSection';
export const puckLabel = 'Inspiration Section';
export const puckCategory = 'Home';

export const puckFields = {
  subheader: { type: 'text' as const, label: 'Subheader' },
  header: { type: 'text' as const, label: 'Header (fallback title)' },
  title: { type: 'text' as const, label: 'Title' },
  description: { type: 'textarea' as const, label: 'Description' },
  ctaText: { type: 'text' as const, label: 'CTA Text' },
  ctaLink: { type: 'text' as const, label: 'CTA Link' },
  backgroundImage: { type: 'text' as const, label: 'Background Image URL' },
  imageAlt: { type: 'text' as const, label: 'Image Alt Text' },
  hotspots: {
    type: 'array' as const,
    label: 'Product Hotspots',
    arrayFields: {
      label: { type: 'text' as const, label: 'Product Name' },
      price: { type: 'number' as const, label: 'Price' },
      slug: { type: 'text' as const, label: 'Product Slug' },
      top: { type: 'text' as const, label: 'Position: Top' },
      right: { type: 'text' as const, label: 'Position: Right' },
      bottom: { type: 'text' as const, label: 'Position: Bottom' },
      left: { type: 'text' as const, label: 'Position: Left' },
    },
    defaultItemProps: {
      label: 'Product Name',
      price: 0,
      slug: 'product-slug',
      top: '',
      right: '',
      bottom: '',
      left: '',
    },
    getItemSummary: (item: HotspotItem) => `${item.label} — $${item.price}`,
  },
};

export const puckDefaults = {
  subheader: 'Style Inspiration',
  header: 'Autumn Edit',
  title: 'Autumn Edit',
  description: 'Discover this season\'s most coveted looks, curated for the modern wardrobe.',
  ctaText: 'Shop the Edit',
  ctaLink: '/collections/all',
  backgroundImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80',
  imageAlt: 'Autumn fashion inspiration',
  hotspots: [
    { label: 'Wool Blend Overcoat', price: 450, slug: 'wool-blend-overcoat', top: '20%', left: '30%' },
    { label: 'Leather Ankle Boots', price: 320, slug: 'leather-ankle-boots', top: '65%', left: '45%' },
    { label: 'Cashmere Scarf', price: 180, slug: 'cashmere-scarf', top: '35%', left: '60%' },
  ],
};

export async function puckDataFetcher() {
  const collection = await fetchInspirationCollection();
  if (!collection) return {};
  return {
    title: collection.title || collection.name || '',
    description: collection.description || collection.subtitle || '',
    backgroundImage: collection.mainImage?.imageUrl || '',
    imageAlt: collection.mainImage?.alt || collection.title || '',
    ctaText: collection.mainImage?.ctaText || '',
    ctaLink: collection.mainImage?.ctaLink || '',
    hotspots: (collection.products || []).slice(0, 4).map((p, i) => ({
      label: p.name,
      price: p.price,
      slug: p.slug,
      top: ['20%', '65%', '35%', '50%'][i] || '50%',
      left: ['30%', '45%', '60%', '70%'][i] || '50%',
    })),
  };
}

export function InspirationSectionView({
  subheader,
  header,
  title,
  description,
  ctaText,
  ctaLink,
  backgroundImage,
  imageAlt,
  hotspots,
  className,
}: InspirationSectionViewProps) {
  const displayTitle = title || header;

  const parsedHotspots = (hotspots || []).map((h, index) => {
    const style: CSSProperties = {};
    if (h.top) style.top = h.top;
    if (h.right) style.right = h.right;
    if (h.bottom) style.bottom = h.bottom;
    if (h.left) style.left = h.left;

    return {
      id: `hotspot-${index}`,
      href: `/products/${h.slug}`,
      label: h.label,
      price: formatPrice(Number(h.price) || 0),
      style,
    };
  });

  return (
    <section className={cn('@container', className)}>
      <div className="relative flex min-h-[36rem] items-center overflow-hidden rounded-card bg-bg-surface shadow-card @lg:min-h-[40rem]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-90"
          style={{ backgroundImage: `url("${backgroundImage}")` }}
          role="img"
          aria-label={imageAlt}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg-overlay via-bg-overlay/70 to-transparent" />

        <div className="relative z-10 ml-auto mr-4 w-full max-w-xl rounded-card border border-border bg-bg-surface/92 p-6 shadow-card backdrop-blur-overlay @md:mr-6 @md:p-8 @lg:mr-12 @lg:p-10">
          <span className="mb-4 block text-xs font-semibold uppercase tracking-[0.24em] text-primary">
            {subheader}
          </span>
          <h2 className="mb-5 text-3xl font-extrabold tracking-tight text-text-base @lg:text-4xl">
            {displayTitle}
          </h2>
          <p className="mb-8 text-base leading-relaxed text-text-muted @md:text-lg">
            {description}
          </p>
          <Link
            href={ctaLink || '/collections/all'}
            className="inline-flex w-full items-center justify-center rounded-button bg-cta-primary px-6 py-3 text-sm font-semibold text-on-primary shadow-button transition-all duration-normal hover:-translate-y-0.5 hover:bg-cta-primary-hover hover:shadow-button-hover"
          >
            {ctaText}
          </Link>
        </div>

        {parsedHotspots.map((hotspot) => (
          <div
            key={hotspot.id}
            className="absolute z-10"
            style={hotspot.style}
          >
            <ProductHotspot
              href={hotspot.href}
              label={hotspot.label}
              price={hotspot.price}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
