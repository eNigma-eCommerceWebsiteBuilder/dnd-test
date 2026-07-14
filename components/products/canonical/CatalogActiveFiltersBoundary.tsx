import { Suspense } from 'react';
import type { ReactNode } from 'react';

interface CatalogActiveFiltersBoundaryProps {
  content?: ReactNode;
}

export function CatalogActiveFiltersBoundary({ content }: CatalogActiveFiltersBoundaryProps) {
  return <Suspense fallback={null}>{content}</Suspense>;
}
