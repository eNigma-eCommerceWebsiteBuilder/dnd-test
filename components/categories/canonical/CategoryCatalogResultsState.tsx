import type { ReactNode } from 'react';

export function CategoryCatalogResultsState({ hasProducts, results, empty }: { hasProducts: boolean; results?: ReactNode; empty?: ReactNode }) {
  return <div className="flex-1">{hasProducts ? results : empty}</div>;
}
