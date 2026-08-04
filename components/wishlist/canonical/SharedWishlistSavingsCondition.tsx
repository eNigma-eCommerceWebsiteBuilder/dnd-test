import type { ReactNode } from 'react';

export function SharedWishlistSavingsCondition({
  visible,
  content,
}: {
  visible: boolean;
  content?: ReactNode;
}) {
  return visible ? content : null;
}
