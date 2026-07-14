import { CategoriesPageLayout } from './CategoriesPageLayout';
import type { CatalogSlot } from '@/components/products/canonical/types';

interface Props { breadcrumbs?: CatalogSlot; intro?: CatalogSlot; trending?: CatalogSlot; departments?: CatalogSlot; }
export const puckComponentName = 'CategoriesPageLayout';
export const puckLabel = 'Categories Page Layout';
export const puckCategory = 'Categories';
export const puckFields = { breadcrumbs: { type: 'slot' as const, allow: ['CategoriesPageBreadcrumbs'] }, intro: { type: 'slot' as const, allow: ['CategoriesPageIntro'] }, trending: { type: 'slot' as const, allow: ['TrendingCategoriesSection'] }, departments: { type: 'slot' as const, allow: ['DepartmentCategoriesSection'] } };
export const puckDefaults = { breadcrumbs: [], intro: [], trending: [], departments: [] };
export const puckAst = { kind: 'runtime', slots: ['breadcrumbs', 'intro', 'trending', 'departments'], sourceJsxNames: ['main'], role: 'categories-page-layout', requiredClasses: ['min-h-screen', 'bg-bg-base', 'text-text-base', 'max-w-[1280px]', 'px-6', 'lg:px-10', 'py-8'] };
export function CategoriesPageLayoutView(props: Props) { return <CategoriesPageLayout breadcrumbs={props.breadcrumbs?.()} intro={props.intro?.()} trending={props.trending?.()} departments={props.departments?.()} />; }
