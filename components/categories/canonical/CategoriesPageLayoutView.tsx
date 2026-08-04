import { CategoriesPageLayout } from './CategoriesPageLayout';
import { puckTransparentSlotProps, type CategoriesSlot } from './types';

interface Props { breadcrumbs?: CategoriesSlot; intro?: CategoriesSlot; trending?: CategoriesSlot; departments?: CategoriesSlot; }
export const puckComponentName = 'CategoriesPageLayout';
export const puckLabel = 'Categories Page Layout';
export const puckCategory = 'Categories';
export const puckFields = { breadcrumbs: { type: 'slot' as const, allow: ['CategoriesPageBreadcrumbs'] }, intro: { type: 'slot' as const, allow: ['CategoriesPageIntro'] }, trending: { type: 'slot' as const, allow: ['TrendingCategoriesSection'] }, departments: { type: 'slot' as const, allow: ['DepartmentCategoriesSection'] } };
export const puckDefaults = { breadcrumbs: [], intro: [], trending: [], departments: [] };
export const puckAst = { kind: 'runtime', slots: ['breadcrumbs', 'intro', 'trending', 'departments'], sourceJsxNames: ['CategoriesPageLayout'], sourceImportPaths: ['@/components/categories/canonical/CategoriesPageLayout'], role: 'categories-page-layout', requiredClasses: ['min-h-screen', 'bg-bg-base', 'text-text-base', 'max-w-[1280px]', 'px-6', 'lg:px-10', 'py-8'] };
export function CategoriesPageLayoutView(props: Props) { return <CategoriesPageLayout breadcrumbs={props.breadcrumbs?.(puckTransparentSlotProps)} intro={props.intro?.(puckTransparentSlotProps)} trending={props.trending?.(puckTransparentSlotProps)} departments={props.departments?.(puckTransparentSlotProps)} />; }
