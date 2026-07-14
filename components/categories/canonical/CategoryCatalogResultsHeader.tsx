import type { ReactNode } from 'react';

export function CategoryCatalogResultsHeader({ totalItems = 0, controls }: { totalItems?: number; controls?: ReactNode }) {
  return <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"><p className="text-text-muted font-medium">{totalItems.toLocaleString()} items in this collection</p><div className="flex items-center gap-4">{controls}</div></div>;
}
