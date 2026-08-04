import { DepartmentCategoriesSection } from './DepartmentCategoriesSection';
import { puckTransparentSlotProps, type CategoriesSlot } from './types';

interface Props { grid?: CategoriesSlot; }
export const puckComponentName = 'DepartmentCategoriesSection';
export const puckLabel = 'Browse by Department Section';
export const puckCategory = 'Categories';
export const puckFields = { grid: { type: 'slot' as const, allow: ['CategoryGrid'] } };
export const puckDefaults = { grid: [] };
export const puckAst = { kind: 'runtime', slots: ['grid'], sourceJsxNames: ['DepartmentCategoriesSection', 'CategoryGrid'], sourceImportPaths: ['@/components/categories/canonical/DepartmentCategoriesSection', '@/components/categories/CategoryGrid'], role: 'department-categories-section', slotTarget: 'departments', runtimeSignals: ['categories.main'], requiredClasses: ['mb-20', 'items-center', 'gap-4', 'mb-8', 'h-[2px]', 'bg-divider'] };
export function DepartmentCategoriesSectionView({ grid }: Props) { return <DepartmentCategoriesSection grid={grid?.(puckTransparentSlotProps)} />; }
