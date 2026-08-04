import type { ReactNode } from 'react';

export type WishlistSlot = (props?: Record<string, unknown>) => ReactNode;

// Slots should not introduce a Puck wrapper into the source-owned layout tree.
export const puckTransparentSlotProps = {
  style: { display: 'contents' },
};
