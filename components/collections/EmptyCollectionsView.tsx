import { EmptyCollections } from '@/enigma-components/collections/EmptyCollections';

export const puckComponentName = 'EmptyCollections';
export const puckLabel = 'Empty Collections State';
export const puckCategory = 'Collections';
export const puckFields = {};
export const puckDefaults = {};
export const puckAst = {
  kind: 'static',
  sourceJsxNames: ['EmptyCollections'],
  sourceImportPaths: ['@/components/collections/EmptyCollections'],
  role: 'empty-collections',
  slotTarget: 'empty',
};

export function EmptyCollectionsView() {
  return <EmptyCollections />;
}
