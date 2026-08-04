import { Suspense } from 'react';
import type { ReactNode } from 'react';

const fallback = <div className="space-y-6"><div className="h-10 bg-bg-skeleton rounded-button animate-skeleton" /><div className="h-40 bg-bg-skeleton rounded-card animate-skeleton" /><div className="h-32 bg-bg-skeleton rounded-card animate-skeleton" /></div>;

export function SearchFilterSidebar({ filters }: { filters?: ReactNode }) {
  return <aside className="w-full lg:w-[280px] flex-shrink-0"><Suspense fallback={fallback}>{filters}</Suspense></aside>;
}
