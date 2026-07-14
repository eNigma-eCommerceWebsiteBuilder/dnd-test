import type { Product } from '@/lib/api/types/products';

export interface StockStatusResult {
  text: string;
  status: 'out' | 'low' | 'available';
  className: string;
}

export type ProductWithStock = Pick<Product, 'stock' | 'inStock' | 'stockThreshold'>;

export function formatStockStatus(product: ProductWithStock): StockStatusResult {
  const { stock, inStock, stockThreshold = 5 } = product;

  if (!inStock || (stock !== undefined && stock <= 0)) {
    return { text: 'Out of Stock', status: 'out', className: 'text-red-500' };
  }

  if (stock !== undefined && stock <= stockThreshold) {
    return { text: `Only ${stock} left`, status: 'low', className: 'text-orange-500' };
  }

  return { text: 'In Stock', status: 'available', className: 'text-green-500' };
}
