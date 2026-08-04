import type { ReactNode } from 'react';

export type AccountDownloadsSlot = (props?: Record<string, unknown>) => ReactNode;

// Nested Puck regions render as normal production children outside the editor chrome.
export const puckTransparentSlotProps = { puck: { isEditing: false } };
