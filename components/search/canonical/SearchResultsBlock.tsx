import type { ReactNode } from 'react';

export function SearchResultsBlock({ controls, grid, pagination }: { controls?: ReactNode; grid?: ReactNode; pagination?: ReactNode }) {
  return <>{controls}{grid}{pagination}</>;
}
