import type { ReactNode } from 'react';

export type AddressesSlot = (props?: Record<string, unknown>) => ReactNode;
export const puckTransparentSlotProps = { puck: { isEditing: false } };
