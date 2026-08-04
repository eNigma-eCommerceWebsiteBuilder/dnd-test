import type { ReactNode } from 'react';

export function SharedWishlistHeaderActionsCondition({
  visible,
  content,
}: {
  visible: boolean;
  content?: ReactNode;
}) {
  return visible ? content : null;
}
