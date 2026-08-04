import type { ReactNode } from 'react';

export type CartSlot = (props?: Record<string, unknown>) => ReactNode;

// Puck slots must not introduce a wrapper into the production layout tree.
export const puckTransparentSlotProps = {
  style: { display: 'contents' },
};
