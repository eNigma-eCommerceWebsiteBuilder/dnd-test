import type { ReactNode } from 'react';

export type SubscriptionCheckoutSlot = (props?: { style?: { display?: string } }) => ReactNode;

export const puckTransparentSlotProps = { style: { display: 'contents' } };
