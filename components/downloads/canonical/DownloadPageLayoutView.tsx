import { DownloadPageLayout } from '@/enigma-components/templates/downloads/DownloadPageSections';
import { puckTransparentSlotProps, type DownloadSlot } from './types';
interface Props { header?: DownloadSlot; content?: DownloadSlot; }
export const puckComponentName = 'DownloadPageLayout'; export const puckLabel = 'Download Page Layout'; export const puckCategory = 'Downloads';
export const puckFields = { header: { type: 'slot' as const, allow: ['DownloadPageHeader'] }, content: { type: 'slot' as const, allow: ['DownloadPageContentLayout'] } };
export const puckDefaults = { header: [], content: [] };
export const puckAst = { kind: 'static', topLevel: true, slots: ['header', 'content'], sourceJsxNames: ['DownloadPage', 'DownloadPageLayout'], sourceImportPaths: ['@/components/templates/downloads/DownloadPage', '@/components/templates/downloads/DownloadPageSections'], role: 'download-page-layout' };
export function DownloadPageLayoutView({ header, content }: Props) { return <DownloadPageLayout header={header?.(puckTransparentSlotProps)} content={content?.(puckTransparentSlotProps)} />; }
