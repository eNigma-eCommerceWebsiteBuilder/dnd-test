import { Suspense } from 'react';
import type { ReactNode } from 'react';

const fallback = <div className="space-y-8"><div className="h-32 bg-bg-skeleton rounded-card animate-skeleton" /><div className="h-24 bg-bg-skeleton rounded-card animate-skeleton" /></div>;
export function CategoryCatalogFilterSidebar({ filters }: { filters?: ReactNode }) {
  return <div className="w-full lg:w-[280px] flex-shrink-0"><Suspense fallback={fallback}>{filters}</Suspense></div>;
}
