import { ReturnsEmptyRegion as ReturnsEmptyRegionRenderer } from '@/enigma-components/returns/canonical/ReturnsPageSections';

export const puckComponentName = 'ReturnsEmptyRegion'; export const puckLabel = 'Returns Empty State'; export const puckCategory = 'Account'; export const puckFields = {}; export const puckDefaults = {};
export const puckAst = { kind: 'static', sourceJsxNames: ['ReturnsEmptyRegion', 'ReturnsEmpty'], sourceImportPaths: ['@/components/returns/canonical/ReturnsPageSections'], role: 'returns-empty-region', slotTarget: 'empty' };
export function ReturnsEmptyRegion() { return <ReturnsEmptyRegionRenderer />; }
