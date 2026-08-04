import type { ReactNode } from 'react';

export function SharedWishlistContentLayout({
  savings,
  items,
}: {
  savings?: ReactNode;
  items?: ReactNode;
}) {
  return <div className="mt-10">{savings}{items}</div>;
}
