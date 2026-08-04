import { SearchBreadcrumbs } from './SearchBreadcrumbs';

export const puckComponentName = 'SearchBreadcrumbs';
export const puckLabel = 'Search Breadcrumbs';
export const puckCategory = 'Search';
export const puckFields = {};
export const puckDefaults = {};
export const puckAst = { kind: 'static', sourceJsxNames: ['SearchBreadcrumbs'], sourceImportPaths: ['@/components/search/canonical/SearchBreadcrumbs'], role: 'search-breadcrumbs', slotTarget: 'breadcrumbs', requiredClasses: ['flex', 'items-center', 'gap-2', 'text-sm', 'text-text-muted', 'mb-6'] };

export function SearchBreadcrumbsView() { return <SearchBreadcrumbs />; }
