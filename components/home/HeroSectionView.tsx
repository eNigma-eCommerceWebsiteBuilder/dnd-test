import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { fetchHeroProduct } from '@/lib/api/services/menu';

interface HeroSectionViewProps {
  title: string;
  productName: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  backgroundImage: string;
  imageAlt: string;
  productSlug: string;
  className?: string;
}

export const puckComponentName = 'HeroSection';
export const puckLabel = 'Hero Section';
export const puckCategory = 'Home';

export const puckFields = {
  title: { type: 'text' as const, label: 'Eyebrow Title' },
  productName: { type: 'text' as const, label: 'Product Name (H1)' },
  subtitle: { type: 'textarea' as const, label: 'Subtitle' },
  ctaPrimary: { type: 'text' as const, label: 'Primary CTA' },
  ctaSecondary: { type: 'text' as const, label: 'Secondary CTA' },
  backgroundImage: { type: 'text' as const, label: 'Background Image URL' },
  imageAlt: { type: 'text' as const, label: 'Image Alt Text' },
  productSlug: { type: 'text' as const, label: 'Product Slug' },
};

export const puckDefaults = {
  title: 'Timeless Quality for the Modern Wardrobe',
  productName: 'Premium Wool Coat',
  subtitle:
    'Discover our curated collection of high-end essentials designed for the sophisticated individual. Effortless luxury, everyday.',
  ctaPrimary: 'Shop the Collection',
  ctaSecondary: 'View Lookbook',
  backgroundImage:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuA6gp8HFBtOLhaLDZsED1w2eDKkeIHp6jt0CCvOR_XUoTQFJEpJEjhZEfhzDVSbO-0M1L7BoveRAyvHMXrc17n2O9joLLbK6-OJgyJEKJUu6k2tvyZvuAmmIhFqMIb4swMAkkEDSROBla5cwwqD4yS4Ve6lHwe3qs-MyH6SQwdlhPnT7ms_ZRYoxinaARe8iQYqsgR0E8hMueI6nHy9Jz3X8uN85CCOJ0JGGLFLfGA6NyKOwhDgbRCoJBD3qKXWi7ehVJWCX5qzs4MN',
  imageAlt: 'Fashion model wearing minimalist high-end clothing in a bright studio',
  productSlug: 'premium-wool-coat',
};

export async function puckDataFetcher() {
  const heroProduct = await fetchHeroProduct();
  return {
    productName: heroProduct.name,
    productSlug: heroProduct.slug,
    backgroundImage: heroProduct.images?.[0] ?? heroProduct.imageUrl ?? '',
    imageAlt: heroProduct.name,
  };
}

export function HeroSectionView({
  title,
  productName,
  subtitle,
  ctaPrimary,
  ctaSecondary,
  backgroundImage,
  imageAlt,
  productSlug,
  className,
}: HeroSectionViewProps) {
  return (
    <section className={cn('@container', className)}>
      <div className="group relative min-h-[32rem] overflow-hidden rounded-card bg-bg-surface shadow-card @lg:min-h-[44rem]">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url("${backgroundImage}")` }}
          role="img"
          aria-label={productName}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-overlay via-bg-overlay/60 to-transparent" />

        <div className="relative flex h-full max-w-3xl flex-col justify-end gap-6 p-6 @md:p-8 @lg:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-text-inverse/80">
            {title}
          </p>
          <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-text-inverse @md:text-5xl @lg:text-7xl">
            {productName}
          </h1>
          <p className="max-w-xl text-base font-medium leading-relaxed text-text-inverse/90 @md:text-lg @lg:text-xl">
            {subtitle}
          </p>
          <div className="flex flex-col gap-3 @md:flex-row">
            <Link
              href={`/products/${productSlug}`}
              className="inline-flex items-center justify-center rounded-button bg-cta-primary px-6 py-3 text-sm font-semibold text-on-primary shadow-button transition-all duration-normal hover:-translate-y-0.5 hover:bg-cta-primary-hover hover:shadow-button-hover @md:px-8 @md:py-4"
            >
              {ctaPrimary}
            </Link>
            <Link
              href="/collections/all"
              className="inline-flex items-center justify-center rounded-button border border-border-light/60 bg-bg-surface/10 px-6 py-3 text-sm font-semibold text-text-inverse backdrop-blur-overlay transition-colors duration-normal hover:bg-bg-surface/20 @md:px-8 @md:py-4"
            >
              {ctaSecondary}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
