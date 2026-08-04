import { fetchInspirationCollection } from '@/lib/api/services/collections';
import type { InspirationCollection, Product } from '@/lib/api/types';
import type { InspirationContent } from '@/lib/content';
import { InspirationSection } from '@/enigma-components/home/InspirationSection';

interface HotspotItem {
  title?: string;
  price?: string;
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
}

interface InspirationSectionViewProps {
  subheader: string;
  header: string;
  description: string;
  ctaText: string;
  image: string;
  alt: string;
  hotspots: HotspotItem[];
  className?: string;
  runtimeCollection?: InspirationCollection | null;
}

export const puckComponentName = 'InspirationSection';
export const puckLabel = 'Inspiration Section';
export const puckCategory = 'Home';

export const puckFields = {
  subheader: { type: 'text' as const, label: 'Subheader' },
  header: { type: 'text' as const, label: 'Header' },
  description: { type: 'textarea' as const, label: 'Description' },
  ctaText: { type: 'text' as const, label: 'CTA Text' },
  image: { type: 'text' as const, label: 'Fallback Image URL' },
  alt: { type: 'text' as const, label: 'Fallback Image Alt Text' },
  hotspots: {
    type: 'array' as const,
    label: 'Hotspot Placements',
    arrayFields: {
      title: { type: 'text' as const, label: 'Source Label' },
      price: { type: 'text' as const, label: 'Source Price' },
      top: { type: 'text' as const, label: 'Position: Top' },
      right: { type: 'text' as const, label: 'Position: Right' },
      bottom: { type: 'text' as const, label: 'Position: Bottom' },
      left: { type: 'text' as const, label: 'Position: Left' },
    },
    defaultItemProps: {
      title: 'Product Name',
      price: '$0.00',
      top: '',
      right: '',
      bottom: '',
      left: '',
    },
    getItemSummary: (item: HotspotItem) => item.title || 'Hotspot',
  },
};

export const puckDefaults = {
  subheader: 'Inspiration',
  header: 'Autumn in the City: A Curated Look',
  description: "Discover how we style this season's most sought-after pieces for the perfect urban ensemble.",
  ctaText: 'Shop the Look',
  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEMrhSDou2quXn3m45RGq7MZg9LrC6bfhIAUm012lCQ_f8jpBzFh738jzvkUbVSvKYNDVMBbivnX7veuwSk3TGH9bNl5BfoEo3grMYfpsMwy6PMb64zfUGaMHrKOmFpveIv6T-oTClRskrusCg2y6dvMwDuVww7KtswcekZJ6mXeuemf16PtjE2eMsmz_HCFBK4MdtRCYMLJe7t0irTEWCIfOh4J0E4vUO2HPqy-uipa55y8s2m73GkCWX_X1GYY22o1m4k7IRLlTW',
  alt: 'Lifestyle scene of a boutique store interior with model',
  hotspots: [
    { title: 'Classic Blazer', price: '$320.00', top: '30%', right: '40%' },
    { title: 'Leather Tote', price: '$550.00', bottom: '40%', right: '25%' },
  ],
};

export const puckAst = {
  kind: 'runtime',
  sourceJsxNames: ['InspirationSection'],
  sourceImportPaths: ['@/components/home/InspirationSection'],
  role: 'home-inspiration',
  runtimeSignals: ['inspirationCollection', 'homepage.inspiration'],
};

export async function puckDataFetcher() {
  try {
    return { runtimeCollection: await fetchInspirationCollection() };
  } catch {
    // This mirrors HomePage's withNull(fetchInspirationCollection()).
    return { runtimeCollection: null };
  }
}

export function InspirationSectionView({
  subheader,
  header,
  description,
  ctaText,
  image,
  alt,
  hotspots = [],
  className,
  runtimeCollection,
}: InspirationSectionViewProps) {
  const content = { subheader, header, description, ctaText, image, alt, hotspots } as unknown as InspirationContent;
  const seedCollection = {
    title: header,
    description,
    mainImage: { imageUrl: image, alt, ctaLink: '/collections/all' },
    products: hotspots.map((hotspot, index) => ({
      _id: `hotspot-${index}`,
      name: hotspot.title || `Product ${index + 1}`,
      slug: `seed-product-${index + 1}`,
      price: Number(String(hotspot.price || '0').replace(/[^0-9.]/g, '')) || 0,
    } as Product)),
  } as InspirationCollection;

  // Undefined is editor seed mode. Null preserves the source route's hidden state.
  const collection = runtimeCollection === undefined ? seedCollection : runtimeCollection;
  return <InspirationSection collection={collection} content={content} className={className} />;
}
