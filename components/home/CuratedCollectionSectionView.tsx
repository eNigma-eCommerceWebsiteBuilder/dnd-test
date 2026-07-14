import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils/cn';
import { ProductCard } from '@/components/ui/ProductCard';
import { fetchCuratedCollections } from '@/lib/api/services/collections';
import type { Product } from '@/lib/api/types';

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

export async function puckDataFetcher() {
  const collections = await fetchCuratedCollections();
  if (!collections || collections.length === 0) return {};
  const c = collections[0];
  return {
    collectionName: c.name || '',
    collectionDescription: c.description || '',
    collectionSlug: c.slug || '',
    mainProductName: c.mainProduct?.name || '',
    mainProductImage: c.mainProduct?.images?.[0] ?? c.mainProduct?.imageUrl ?? '',
    relatedProducts: (c.relatedProducts || []).map((p) => ({
      id: p.id || p._id,
      _id: p._id || p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      salePrice: p.salePrice ?? undefined,
      originalPrice: p.originalPrice,
      inStock: p.inStock !== false,
      stock: p.stock,
      image: p.images?.[0] ?? p.imageUrl ?? '',
      images: p.images || [],
    })),
  };
}

function toProduct(item: RelatedProductItem): Product {
  const productId = item.id || item._id;

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
  relatedProducts,
  className,
}: CuratedCollectionSectionViewProps) {
  return (
    <section className={cn('@container flex flex-col gap-8', className)}>
      <div className="flex flex-col items-center gap-8 overflow-hidden rounded-card border border-border bg-bg-surface p-6 shadow-card @lg:flex-row @lg:p-10">
        <div className="flex-1 space-y-5">
          <span className="block text-xs font-semibold uppercase tracking-[0.24em] text-primary">
            {eyebrow}
          </span>
          <h2 className="text-3xl font-black tracking-tight text-text-base @md:text-4xl">
            {collectionName}
          </h2>
          <p className="text-base leading-relaxed text-text-muted @md:text-lg">
            {collectionDescription}
          </p>
          <Link
            href={`/collections/${collectionSlug}`}
            className="inline-flex items-center justify-center rounded-button bg-cta-primary px-6 py-3 text-sm font-semibold text-on-primary shadow-button transition-all duration-normal hover:-translate-y-0.5 hover:bg-cta-primary-hover hover:shadow-button-hover"
          >
            {ctaText}
          </Link>
        </div>

        {mainProductImage && (
          <div className="relative aspect-square w-full max-w-xl flex-1 overflow-hidden rounded-image border border-border bg-bg-sunken">
            <Image
              src={mainProductImage}
              alt={mainProductName}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        )}
      </div>

      {relatedProducts && relatedProducts.length > 0 && (
        <div className="grid grid-cols-2 @md:grid-cols-4 gap-6">
          {relatedProducts.slice(0, 4).map((item, index) => (
            <ProductCard
              key={item.id || item._id || item.slug || index}
              product={toProduct(item)}
              showWishlist={false}
              showQuickAdd={Boolean(item.id || item._id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
