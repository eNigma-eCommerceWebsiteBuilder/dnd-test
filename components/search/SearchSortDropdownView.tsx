import { SortDropdown } from '@/components/products/SortDropdown';
export const puckComponentName = 'SearchSortDropdown'; export const puckLabel = 'Search Sort Dropdown'; export const puckCategory = 'Search'; export const puckFields = {}; export const puckDefaults = {};
export const puckAst = { kind: 'runtime', sourceJsxNames: ['SortDropdown'], sourceImportPaths: ['@/components/products/SortDropdown'], role: 'search-sort-dropdown', slotTarget: 'content', runtimeSignals: ['searchParams.sort'] };
export function SearchSortDropdownView() { return <SortDropdown />; }
