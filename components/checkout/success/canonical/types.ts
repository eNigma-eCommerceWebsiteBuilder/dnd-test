import type { ReactNode } from 'react';
export type CheckoutSuccessSlot = (props?: Record<string, unknown>) => ReactNode;

export const puckTransparentSlotProps = {
  style: { display: 'contents' },
};
