import { fetchFeaturedProducts } from '@/lib/api/services/products';
import type { Product } from '@/lib/api/types/products';
import type { FeaturedProductsContent } from '@/lib/content';
import { FeaturedProductsGrid } from '@/enigma-components/home/FeaturedProductsGrid';

interface ProductItem {
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

interface FeaturedProductsGridViewProps {
  header: string;
  subheader: string;
  products: ProductItem[];
  className?: string;
  runtimeProducts?: Product[];
}

export const puckComponentName = 'FeaturedProductsGrid';
export const puckLabel = 'Featured Products Grid';
export const puckCategory = 'Home';

export const puckFields = {
  header: { type: 'text' as const, label: 'Header' },
  subheader: { type: 'text' as const, label: 'Subheader' },
  products: {
    type: 'array' as const,
    label: 'Products',
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
    getItemSummary: (item: ProductItem) => `${item.name} — $${item.price}`,
  },
};

export const puckDefaults = {
  header: 'Featured Products',
  subheader: 'Essentials',
  products: [
    { name: 'Premium Wool Coat', slug: 'premium-wool-coat', price: 450, image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=80' },
    { name: 'Silk Blend Shirt', slug: 'silk-blend-shirt', price: 180, image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80' },
    { name: 'Leather Tote Bag', slug: 'leather-tote-bag', price: 550, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80' },
    { name: 'Cashmere Sweater', slug: 'cashmere-sweater', price: 320, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80' },
  ],
};
export const puckAst = { kind: 'runtime', sourceJsxNames: ['FeaturedProductsGrid'], sourceImportPaths: ['@/components/home/FeaturedProductsGrid'], role: 'home-featured-products', runtimeSignals: ['featuredProducts', 'homepage.featuredProducts'] };

export async function puckDataFetcher() {
  try {
    return { runtimeProducts: await fetchFeaturedProducts(8) };
  } catch {
    // This mirrors HomePage's withFallback(fetchFeaturedProducts(8), []).
    return { runtimeProducts: [] };
  }
}

function toProduct(item: ProductItem): Product {
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

export function FeaturedProductsGridView({
  header,
  subheader,
  products: items = [],
  className,
  runtimeProducts,
}: FeaturedProductsGridViewProps) {
  const content = { header, subheader } as FeaturedProductsContent;
  const products = runtimeProducts === undefined ? items.map(toProduct) : runtimeProducts;
  return <FeaturedProductsGrid content={content} products={products} className={className} />;
}
