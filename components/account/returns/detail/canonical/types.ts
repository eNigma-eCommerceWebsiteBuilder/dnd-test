import type { ReactNode } from 'react';

export type ReturnDetailsSlot = ((props?: Record<string, unknown>) => ReactNode) | undefined;

// Puck wrappers must not become additional flex or grid children in copied JSX.
export const puckTransparentSlotProps = { style: { display: 'contents' } };
