import type { ReactNode } from 'react';

export type HomeSlot = ((props?: Record<string, unknown>) => ReactNode) | undefined;

// Puck wraps slot content by default. The source home route renders each
// section as a direct child of <main>, so keep the generated wrapper inert.
export const puckTransparentSlotProps = { style: { display: 'contents' } };
