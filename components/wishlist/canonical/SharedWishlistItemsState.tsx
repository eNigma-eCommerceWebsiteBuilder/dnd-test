import type { ReactNode } from 'react';

export function SharedWishlistItemsState({
  hasItems,
  empty,
  grid,
}: {
  hasItems: boolean;
  empty?: ReactNode;
  grid?: ReactNode;
}) {
  return <>{hasItems ? grid : empty}</>;
}
