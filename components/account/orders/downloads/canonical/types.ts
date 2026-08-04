import type { ReactNode } from 'react';
export type OrderDownloadsSlot = (props?: Record<string, unknown>) => ReactNode;
export const puckTransparentSlotProps = { puck: { isEditing: false } };
