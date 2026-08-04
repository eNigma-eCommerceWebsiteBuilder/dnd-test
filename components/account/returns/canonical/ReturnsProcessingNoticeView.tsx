import { ReturnsProcessingNotice as ReturnsProcessingNoticeRenderer } from '@/enigma-components/returns/canonical/ReturnsPageSections';

export const puckComponentName = 'ReturnsProcessingNotice'; export const puckLabel = 'Returns Processing Notice'; export const puckCategory = 'Account'; export const puckFields = {}; export const puckDefaults = {};
export const puckAst = { kind: 'static', sourceJsxNames: ['ReturnsProcessingNotice'], sourceImportPaths: ['@/components/returns/canonical/ReturnsPageSections'], role: 'returns-processing-notice', slotTarget: 'notice' };
export function ReturnsProcessingNotice() { return <ReturnsProcessingNoticeRenderer />; }
