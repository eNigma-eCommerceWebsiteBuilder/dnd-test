import { Suspense } from 'react';
import type { ReactNode } from 'react';
import { ProductGridSkeleton } from '../ProductGridSkeleton';

interface CatalogGridBoundaryProps {
  pageSize?: number;
  grid?: ReactNode;
}

export function CatalogGridBoundary({ pageSize = 12, grid }: CatalogGridBoundaryProps) {
  return <Suspense fallback={<ProductGridSkeleton count={pageSize} />}>{grid}</Suspense>;
}
