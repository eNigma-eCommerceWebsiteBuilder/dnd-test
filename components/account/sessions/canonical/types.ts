import type { ReactNode } from 'react';

export type AccountSessionsSlot = (props?: Record<string, unknown>) => ReactNode;
export const puckTransparentSlotProps = { puck: { isEditing: false } };
