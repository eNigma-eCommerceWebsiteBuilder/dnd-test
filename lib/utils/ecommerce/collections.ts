import type { Product } from '@/lib/api/types/products';

// Compatibility surface required by the production CuratedProductDisplay.
export type CuratedProduct = Product;

export interface CuratedCollection {
  mainProduct?: CuratedProduct;
  relatedProducts?: CuratedProduct[];
  products?: CuratedProduct[];
}

export function getAllCollectionProducts(
  collections: CuratedCollection[] = [],
): CuratedProduct[] {
  const productMap = new Map<string, CuratedProduct>();
  for (const collection of collections) {
    if (collection.mainProduct) productMap.set(collection.mainProduct._id, collection.mainProduct);
    for (const product of collection.relatedProducts ?? []) productMap.set(product._id, product);
    for (const product of collection.products ?? []) productMap.set(product._id, product);
  }
  return Array.from(productMap.values());
}
