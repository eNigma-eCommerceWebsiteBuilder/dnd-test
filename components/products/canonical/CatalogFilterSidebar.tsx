import { Suspense } from 'react';
import type { ReactNode } from 'react';

interface CatalogFilterSidebarProps {
  filters?: ReactNode;
}

const fallback = (
  <div className="space-y-8">
    <div className="h-40 bg-bg-skeleton rounded-card animate-pulse" />
    <div className="h-32 bg-bg-skeleton rounded-card animate-pulse" />
    <div className="h-24 bg-bg-skeleton rounded-card animate-pulse" />
  </div>
);

export function CatalogFilterSidebar({ filters }: CatalogFilterSidebarProps) {
  return (
    <div className="hidden lg:block w-[280px] flex-shrink-0">
      <Suspense fallback={fallback}>{filters}</Suspense>
    </div>
  );
}
