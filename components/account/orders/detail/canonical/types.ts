import type { ReactNode } from 'react';

export type OrderDetailsSlot = ((props?: Record<string, unknown>) => ReactNode) | undefined;

// Puck's editing wrappers must not become extra flex/grid children in the source layout.
export const puckTransparentSlotProps = { style: { display: 'contents' } };
