import { fetchHeroProduct } from '@/lib/api/services/menu';
import type { HeroProduct } from '@/lib/api/types';
import type { HeroContent } from '@/lib/content';
import { HeroSection } from '@/enigma-components/home/HeroSection';

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
  runtimeHeroProduct?: HeroProduct | null;
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
export const puckAst = { kind: 'runtime', sourceJsxNames: ['HeroSection'], sourceImportPaths: ['@/components/home/HeroSection'], role: 'home-hero', runtimeSignals: ['heroProduct', 'homepage.hero'] };

export async function puckDataFetcher() {
  try {
    return { runtimeHeroProduct: await fetchHeroProduct() };
  } catch {
    // This mirrors HomePage's withNull(fetchHeroProduct()).
    return { runtimeHeroProduct: null };
  }
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
  runtimeHeroProduct,
}: HeroSectionViewProps) {
  const content = { title, subtitle, ctaPrimary, ctaSecondary, backgroundImage, imageAlt } as HeroContent;
  const seedHeroProduct = { name: productName, slug: productSlug, description: subtitle, images: [backgroundImage] } as HeroProduct;

  // Undefined is editor seed mode. Null preserves the source route's hidden state.
  const heroProduct = runtimeHeroProduct === undefined ? seedHeroProduct : runtimeHeroProduct;
  return <HeroSection content={content} heroProduct={heroProduct} className={className} />;
}
