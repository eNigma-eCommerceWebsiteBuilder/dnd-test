import { DownloadPageHeader } from '@/enigma-components/templates/downloads/DownloadPageSections';
export const puckComponentName = 'DownloadPageHeader'; export const puckLabel = 'Download Page Header'; export const puckCategory = 'Downloads'; export const puckFields = {}; export const puckDefaults = {};
export const puckAst = { kind: 'static', sourceJsxNames: ['DownloadPageHeader', 'header'], sourceImportPaths: ['@/components/templates/downloads/DownloadPageSections'], role: 'download-page-header', slotTarget: 'header' };
export function DownloadPageHeaderView() { return <DownloadPageHeader />; }
