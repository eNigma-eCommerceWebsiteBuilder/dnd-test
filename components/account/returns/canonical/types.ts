import type { ReactNode } from 'react';

export type AccountReturnsSlot = (props?: Record<string, unknown>) => ReactNode;
export const puckTransparentSlotProps = { puck: { isEditing: false } };
