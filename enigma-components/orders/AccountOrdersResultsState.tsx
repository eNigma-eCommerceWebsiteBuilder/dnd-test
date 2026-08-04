import type { ReactNode } from 'react';

interface AccountOrdersResultsStateProps {
  hasOrders: boolean;
  results: ReactNode;
  empty: ReactNode;
}

export function AccountOrdersResultsState({
  hasOrders,
  results,
  empty,
}: AccountOrdersResultsStateProps) {
  return hasOrders ? <>{results}</> : <>{empty}</>;
}
