import { DigitalLibraryHeader as DigitalLibraryHeaderRenderer } from '@/enigma-components/account/downloads/canonical/DigitalLibrarySections';

export const puckComponentName = 'DigitalLibraryHeader';
export const puckLabel = 'Digital Library Header';
export const puckCategory = 'Account';
export const puckFields = {};
export const puckDefaults = {};
export const puckAst = { kind: 'static', sourceJsxNames: ['DigitalLibraryHeader'], sourceImportPaths: ['@/components/account/downloads/canonical/DigitalLibrarySections'], role: 'digital-library-header', slotTarget: 'header' };

export function DigitalLibraryHeader() { return <DigitalLibraryHeaderRenderer />; }
