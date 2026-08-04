import type { ReactNode } from 'react';

export type AccountSlot = ((props?: Record<string, unknown>) => ReactNode) | undefined;

// Preserve direct source children when Puck renders a slot.
export const puckTransparentSlotProps = { style: { display: 'contents' } };
