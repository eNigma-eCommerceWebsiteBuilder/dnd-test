import type { ReactNode } from 'react';

export type CollectionsSlot =
  | ((props?: Record<string, unknown>) => ReactNode)
  | undefined;

export const puckTransparentSlotProps = {
  style: { display: 'contents' },
};
