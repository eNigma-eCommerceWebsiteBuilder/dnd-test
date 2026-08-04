import type { ReactNode } from 'react';

export type AccountSubscriptionsSlot = (props?: Record<string, unknown>) => ReactNode;

// Slots render source JSX rather than editor chrome in published pages.
export const puckTransparentSlotProps = { puck: { isEditing: false } };
