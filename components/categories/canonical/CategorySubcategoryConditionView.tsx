import { CategorySubcategoryCondition } from './CategorySubcategoryCondition';
import { loadCategoryCatalogRuntime } from './categoryCatalogRuntime';
import { puckTransparentSlotProps, type CategoriesSlot } from './types';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';

interface Props { hasSiblings?: boolean; previewMode?: 'visible' | 'hidden'; content?: CategoriesSlot; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'CategorySubcategoryCondition';
export const puckLabel = 'Sibling Category Condition';
export const puckCategory = 'Categories';
export const puckFields = { previewMode: { type: 'select' as const, options: [{ label: 'Visible', value: 'visible' }, { label: 'Hidden', value: 'hidden' }] }, content: { type: 'slot' as const, allow: ['SubcategoryNav'] } };
export const puckDefaults = { previewMode: 'visible', content: [] };
export const puckAst = { kind: 'runtime', slots: ['content'], sourceJsxNames: ['CategorySubcategoryCondition', 'SubcategoryNav'], sourceImportPaths: ['@/components/categories/canonical/CategorySubcategoryCondition', '@/components/categories/SubcategoryNav'], role: 'category-subcategory-condition', slotTarget: 'subcategories', conditional: 'siblingCategories.length > 0', runtimeSignals: ['category.siblings'] };
export async function puckDataFetcher(_props: Props, context?: PuckFetcherContext) { const runtime = await loadCategoryCatalogRuntime(context); return runtime ? { hasSiblings: runtime.siblingCategories.length > 0 } : {}; }
export function CategorySubcategoryConditionView(props: Props) {
  const hasSiblings = props.hasSiblings ?? (props.puck?.isEditing ? props.previewMode !== 'hidden' : false);
  return <CategorySubcategoryCondition hasSiblings={hasSiblings} content={props.content?.(puckTransparentSlotProps)} />;
}
