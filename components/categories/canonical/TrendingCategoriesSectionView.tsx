import { TrendingCategoriesSection } from './TrendingCategoriesSection';
import { loadCategoriesPageRuntimeData } from './categoriesPageRuntime';
import { puckTransparentSlotProps, type CategoriesSlot } from './types';

interface Props { hasTrending?: boolean; previewMode?: 'visible' | 'hidden'; cards?: CategoriesSlot; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'TrendingCategoriesSection';
export const puckLabel = 'Trending Categories Section';
export const puckCategory = 'Categories';
export const puckFields = { previewMode: { type: 'select' as const, options: [{ label: 'Visible', value: 'visible' }, { label: 'Hidden', value: 'hidden' }] }, cards: { type: 'slot' as const, allow: ['TrendingCategoryCard'] } };
export const puckDefaults = { previewMode: 'visible', cards: [] };
export const puckAst = { kind: 'runtime', slots: ['cards'], sourceJsxNames: ['TrendingCategoriesSection', 'TrendingCategoryCard'], sourceImportPaths: ['@/components/categories/canonical/TrendingCategoriesSection', '@/components/categories/TrendingCategoryCard'], role: 'trending-categories-section', slotTarget: 'trending', conditional: 'topTrending.length > 0', runtimeSignals: ['categories.trending'], list: { slot: 'cards', previewCount: 2, indexProp: 'position' }, requiredClasses: ['mb-16', 'items-end', 'justify-between', 'grid', 'md:grid-cols-2', 'gap-6'] };
export async function puckDataFetcher() { const runtime = await loadCategoriesPageRuntimeData(); return { hasTrending: runtime.topTrending.length > 0 }; }
export function TrendingCategoriesSectionView(props: Props) {
  const hasTrending = props.hasTrending ?? (props.puck?.isEditing ? props.previewMode !== 'hidden' : false);
  return <TrendingCategoriesSection hasTrending={hasTrending} cards={props.cards?.(puckTransparentSlotProps)} />;
}
