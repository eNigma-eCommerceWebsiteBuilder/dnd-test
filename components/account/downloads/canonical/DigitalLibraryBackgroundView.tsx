import { DigitalLibraryBackground as DigitalLibraryBackgroundRenderer } from '@/enigma-components/account/downloads/canonical/DigitalLibrarySections';

export const puckComponentName = 'DigitalLibraryBackground'; export const puckLabel = 'Digital Library Background'; export const puckCategory = 'Account'; export const puckFields = {}; export const puckDefaults = {};
export const puckAst = { kind: 'static', sourceJsxNames: ['DigitalLibraryBackground'], sourceImportPaths: ['@/components/account/downloads/canonical/DigitalLibrarySections'], role: 'digital-library-background', slotTarget: 'background', requiredClasses: ['pointer-events-none', '-z-10'] };
export function DigitalLibraryBackground() { return <DigitalLibraryBackgroundRenderer />; }
