import type { ReactNode } from 'react';

export type CheckoutSlot = (props?: { style?: { display?: string } }) => ReactNode;

export const puckTransparentSlotProps = { style: { display: 'contents' } };
