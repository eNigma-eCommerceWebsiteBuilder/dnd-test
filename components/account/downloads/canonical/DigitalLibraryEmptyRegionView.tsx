import { DigitalLibraryEmptyRegion as DigitalLibraryEmptyRegionRenderer } from '@/enigma-components/account/downloads/canonical/DigitalLibrarySections';

export const puckComponentName = 'DigitalLibraryEmptyRegion'; export const puckLabel = 'Digital Library Empty State'; export const puckCategory = 'Account'; export const puckFields = {}; export const puckDefaults = {};
export const puckAst = { kind: 'static', sourceJsxNames: ['DigitalLibraryEmptyRegion', 'EmptyDownloads'], sourceImportPaths: ['@/components/account/downloads/canonical/DigitalLibrarySections'], role: 'digital-library-empty-region', slotTarget: 'empty' };
export function DigitalLibraryEmptyRegion() { return <DigitalLibraryEmptyRegionRenderer />; }
