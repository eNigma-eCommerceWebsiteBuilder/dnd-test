import type { ReactNode } from 'react';

export type SearchSlot = ((props?: Record<string, unknown>) => ReactNode) | undefined;

// Puck's slot wrapper must not become a layout node in the source JSX tree.
export const puckTransparentSlotProps = { style: { display: 'contents' } };
