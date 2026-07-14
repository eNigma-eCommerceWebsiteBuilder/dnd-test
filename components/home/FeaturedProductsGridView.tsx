import { ProductCard } from '@/components/ui/ProductCard';
import { ProductImpressionTracker } from '@/lib/analytics';
import { cn } from '@/lib/utils/cn';
import { fetchFeaturedProducts } from '@/lib/api/services/products';
import type { Product } from '@/lib/api/types/products';

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

export async function puckDataFetcher() {
  const products = await fetchFeaturedProducts(8);
  return {
    products: products.map((p) => ({
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
  products: items,
  className,
}: FeaturedProductsGridViewProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <ProductImpressionTracker listName={header}>
      <section className={cn('@container bg-bg-base', className)}>
        <div className="mb-12">
          <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-primary">
            {subheader}
          </span>
          <h2 className="text-3xl font-extrabold text-text-base @lg:text-4xl">
            {header}
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-8 @sm:grid-cols-2 @lg:grid-cols-4">
          {items.map((item, index) => (
            <div
              key={item.id || item._id || item.slug || index}
              className="w-full"
              data-analytics-product-id={item.id || item._id}
              data-analytics-product-name={item.name}
              data-analytics-product-price={item.price}
              data-analytics-product-category=""
              data-analytics-position={index + 1}
              data-analytics-list={header}
            >
              <ProductCard
                product={toProduct(item)}
                showQuickAdd={Boolean(item.id || item._id)}
                showWishlist
              />
            </div>
          ))}
        </div>
      </section>
    </ProductImpressionTracker>
  );
}
