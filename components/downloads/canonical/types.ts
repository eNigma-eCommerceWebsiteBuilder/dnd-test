import type { ReactNode } from 'react';

export type DownloadSlot = (props?: { style?: { display?: string } }) => ReactNode;

export const puckTransparentSlotProps = { style: { display: 'contents' } };
