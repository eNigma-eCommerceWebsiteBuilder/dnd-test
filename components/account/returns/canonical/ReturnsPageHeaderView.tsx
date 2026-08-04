import { ReturnsPageHeader as ReturnsPageHeaderRenderer } from '@/enigma-components/returns/canonical/ReturnsPageSections';

export const puckComponentName = 'ReturnsPageHeader'; export const puckLabel = 'Returns Page Header'; export const puckCategory = 'Account'; export const puckFields = {}; export const puckDefaults = {};
export const puckAst = { kind: 'static', sourceJsxNames: ['ReturnsPageHeader'], sourceImportPaths: ['@/components/returns/canonical/ReturnsPageSections'], role: 'returns-page-header', slotTarget: 'header' };
export function ReturnsPageHeader() { return <ReturnsPageHeaderRenderer />; }
