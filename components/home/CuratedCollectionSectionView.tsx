import { fetchCuratedCollections } from '@/lib/api/services/collections';
import type { CuratedCollection, Product } from '@/lib/api/types';
import type { CuratedCollectionContent } from '@/lib/content';
import { CuratedCollectionSection } from '@/enigma-components/home/CuratedCollectionSection';

interface RelatedProductItem {
  id?: string;
  _id?: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number;
  originalPrice?: number;
  inStock?: boolean;
  stock?: number;
  image: string;
  images?: string[];
}

interface CuratedCollectionSectionViewProps {
  eyebrow: string;
  ctaText: string;
  collectionName: string;
  collectionDescription: string;
  collectionSlug: string;
  mainProductName: string;
  mainProductImage: string;
  relatedProducts: RelatedProductItem[];
  className?: string;
  runtimeCollection?: CuratedCollection | null;
}

export const puckComponentName = 'CuratedCollectionSection';
export const puckLabel = 'Curated Collection Section';
export const puckCategory = 'Home';

export const puckFields = {
  eyebrow: { type: 'text' as const, label: 'Eyebrow' },
  ctaText: { type: 'text' as const, label: 'CTA Text' },
  collectionName: { type: 'text' as const, label: 'Collection Name' },
  collectionDescription: { type: 'textarea' as const, label: 'Collection Description' },
  collectionSlug: { type: 'text' as const, label: 'Collection Slug' },
  mainProductName: { type: 'text' as const, label: 'Main Product Name' },
  mainProductImage: { type: 'text' as const, label: 'Main Product Image URL' },
  relatedProducts: {
    type: 'array' as const,
    label: 'Related Products',
    arrayFields: {
      name: { type: 'text' as const, label: 'Name' },
      id: { type: 'text' as const, label: 'Backend Product ID' },
      slug: { type: 'text' as const, label: 'Slug' },
      price: { type: 'number' as const, label: 'Price' },
      image: { type: 'text' as const, label: 'Image URL' },
    },
    defaultItemProps: {
      name: 'New Product',
      slug: 'new-product',
      price: 0,
      image: '',
    },
    getItemSummary: (item: RelatedProductItem) => `${item.name} — $${item.price}`,
  },
};

export const puckDefaults = {
  eyebrow: 'Curated Collection',
  ctaText: 'Explore Collection',
  collectionName: 'Autumn Essentials',
  collectionDescription: 'A curated selection of premium pieces for the season.',
  collectionSlug: 'autumn-essentials',
  mainProductName: 'Signature Trench Coat',
  mainProductImage: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80',
  relatedProducts: [
    { name: 'Premium Wool Coat', slug: 'premium-wool-coat', price: 450, image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=80' },
    { name: 'Silk Blend Shirt', slug: 'silk-blend-shirt', price: 180, image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80' },
    { name: 'Leather Tote Bag', slug: 'leather-tote-bag', price: 550, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80' },
    { name: 'Cashmere Sweater', slug: 'cashmere-sweater', price: 320, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80' },
  ],
};
export const puckAst = { kind: 'runtime', sourceJsxNames: ['CuratedCollectionSection'], sourceImportPaths: ['@/components/home/CuratedCollectionSection'], role: 'home-curated-collection', runtimeSignals: ['curatedCollections', 'homepage.curatedCollection'] };

export async function puckDataFetcher() {
  try {
    const collections = await fetchCuratedCollections();
    return { runtimeCollection: collections?.[0] ?? null };
  } catch {
    // This mirrors HomePage's withFallback(fetchCuratedCollections(), []).
    return { runtimeCollection: null };
  }
}

function toProduct(item: RelatedProductItem, index: number): Product {
  // The production renderer keys related cards by _id; editor seed items do not have backend IDs.
  const productId = item.id || item._id || item.slug || `puck-related-product-${index}`;

  return {
    ...(productId ? { id: productId, _id: productId } : {}),
    name: item.name,
    slug: item.slug,
    price: Number(item.price) || 0,
    salePrice: item.salePrice,
    originalPrice: item.originalPrice,
    images: item.images?.length ? item.images : [item.image || '/placeholder.jpg'],
    inStock: item.inStock !== false,
    stock: item.stock ?? 10,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  } as Product;
}

export function CuratedCollectionSectionView({
  eyebrow,
  ctaText,
  collectionName,
  collectionDescription,
  collectionSlug,
  mainProductName,
  mainProductImage,
  relatedProducts = [],
  className,
  runtimeCollection,
}: CuratedCollectionSectionViewProps) {
  const seedCollection = {
    name: collectionName,
    description: collectionDescription,
    slug: collectionSlug,
    mainProduct: mainProductName ? ({ name: mainProductName, images: [mainProductImage] } as Product) : undefined,
    relatedProducts: relatedProducts.map(toProduct),
  } as CuratedCollection;
  const content = { eyebrow, ctaText } as CuratedCollectionContent;
  const collection = runtimeCollection === undefined ? seedCollection : runtimeCollection;
  return <CuratedCollectionSection collection={collection} content={content} className={className} />;
}
