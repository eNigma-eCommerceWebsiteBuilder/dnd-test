import type { ReactNode } from 'react';

interface CatalogResultsStateProps {
  hasProducts?: boolean;
  previewMode?: 'results' | 'empty';
  results?: ReactNode;
  empty?: ReactNode;
}

// Owns the source products.length > 0 branch so both Puck slots never render together.
export function CatalogResultsState({
  hasProducts,
  previewMode = 'results',
  results,
  empty,
}: CatalogResultsStateProps) {
  const showResults = hasProducts === undefined ? previewMode === 'results' : hasProducts;
  return <div className="flex-1">{showResults ? results : empty}</div>;
}
