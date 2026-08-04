import type { ReactNode } from 'react';

export type CatalogSlot = (props?: Record<string, unknown>) => ReactNode;

// Puck wraps each slot item. Canonical source JSX needs the item itself to
// remain the layout child, so Views pass this to Puck's wrapper, not renderers.
export const puckTransparentSlotProps = { style: { display: 'contents' } };
