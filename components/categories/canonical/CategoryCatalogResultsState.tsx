import type { ReactNode } from 'react';

export function CategoryCatalogResultsState({ hasProducts, previewMode = 'results', results, empty }: { hasProducts?: boolean; previewMode?: 'results' | 'empty'; results?: ReactNode; empty?: ReactNode }) {
  const showResults = hasProducts === undefined ? previewMode === 'results' : hasProducts;
  return <div className="flex-1">{showResults ? results : empty}</div>;
}
