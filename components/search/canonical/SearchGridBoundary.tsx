import { Suspense } from 'react';
import type { ReactNode } from 'react';
import { ProductGridSkeleton } from '@/components/products/ProductGridSkeleton';

export function SearchGridBoundary({ pageSize = 12, content }: { pageSize?: number; content?: ReactNode }) {
  return <Suspense fallback={<ProductGridSkeleton count={pageSize} />}>{content}</Suspense>;
}
