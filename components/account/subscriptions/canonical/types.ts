import type { ReactNode } from 'react';

export type SubscriptionDetailSlot = ((props?: Record<string, unknown>) => ReactNode) | undefined;

// Prevent Puck's editing wrappers from changing the production flex and grid layout.
export const puckTransparentSlotProps = { style: { display: 'contents' } };
