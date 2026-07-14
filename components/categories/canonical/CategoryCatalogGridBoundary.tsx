import { Suspense } from 'react';
import type { ReactNode } from 'react';
import { ProductGridSkeleton } from '@/components/products/ProductGridSkeleton';

export function CategoryCatalogGridBoundary({ pageSize = 12, grid }: { pageSize?: number; grid?: ReactNode }) {
  return <Suspense fallback={<ProductGridSkeleton count={pageSize} />}>{grid}</Suspense>;
}
