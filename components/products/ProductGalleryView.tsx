import { ProductGallery } from './ProductGallery';
import { fetchProduct } from '@/lib/api/services/products';
import { resolveProductDetailSlug } from './product-detail-route';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';

interface ProductGalleryViewProps {
  productSlug: string;
  images: string[];
  productName: string;
  className?: string;
}

export const puckComponentName = 'ProductGallery';
export const puckLabel = 'Product Gallery';
export const puckCategory = 'Products';

export const puckFields = {
  productSlug: { type: 'text' as const, label: 'Product Slug (for data fetch)' },
  productName: { type: 'text' as const, label: 'Product Name' },
  images: {
    type: 'array' as const,
    label: 'Images',
    arrayFields: {
      image: { type: 'text' as const, label: 'Image URL' },
    },
    defaultItemProps: {
      image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80',
    },
    getItemSummary: () => 'Image',
  },
};

export const puckDefaults = {
  productSlug: 'premium-wool-coat',
  productName: 'Premium Wool Coat',
  images: [
    'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80',
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80',
  ],
};
export const puckAst = { kind: 'runtime', sourceJsxNames: ['ProductGallery'], sourceImportPaths: ['@/components/products/ProductGallery'], role: 'product-gallery', runtimeSignals: ['product.images'] };

export async function puckDataFetcher(props: { productSlug?: string }, context?: PuckFetcherContext) {
  const productSlug = resolveProductDetailSlug(props, context);
  if (!productSlug) return {};
  const product = await fetchProduct(productSlug);
  return {
    productName: product.name,
    images: product.images ?? [],
  };
}


export function ProductGalleryView({ images, productName, className }: ProductGalleryViewProps) {
  return (
    <ProductGallery
      images={images}
      productName={productName}
      className={className}
    />
  );
}
