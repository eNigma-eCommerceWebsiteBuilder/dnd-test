import type { ReactNode } from 'react';

export function SearchQueryState({ query, hasResults, results, noResults, start }: { query: string; hasResults: boolean; results?: ReactNode; noResults?: ReactNode; start?: ReactNode }) {
  return <div className="flex-1">{query ? hasResults ? results : noResults : start}</div>;
}
