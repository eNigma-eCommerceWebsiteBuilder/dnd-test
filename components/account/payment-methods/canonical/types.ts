import type { ReactNode } from 'react';

export type PaymentMethodsSlot = (props?: Record<string, unknown>) => ReactNode;
export const puckTransparentSlotProps = { puck: { isEditing: false } };
