import type { ReactNode } from 'react';

export type AccountOrdersSlot = ((props?: Record<string, unknown>) => ReactNode) | undefined;

// Preserve direct source children when Puck renders a slot.
export const puckTransparentSlotProps = { style: { display: 'contents' } };
