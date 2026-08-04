import type { ReactNode } from 'react';
export type OrderReturnSlot = ((props?: Record<string, unknown>) => ReactNode) | undefined;
export const puckTransparentSlotProps = { style: { display: 'contents' } };
