import { CatalogControlsLayout } from './CatalogControlsLayout';
import { puckTransparentSlotProps, type CatalogSlot } from './types';

interface CatalogControlsLayoutViewProps { controls?: CatalogSlot; }

export const puckComponentName = 'CatalogControlsLayout';
export const puckLabel = 'Catalog Controls Layout';
export const puckCategory = 'Products';
export const puckFields = {
  controls: { type: 'slot' as const, allow: ['MobileFilterDrawerBlock', 'ViewToggleBlock', 'SortDropdownBlock'] },
};
export const puckDefaults = { controls: [] };
export const puckAst = {
  kind: 'static', slots: ['controls'], sourceJsxNames: ['CatalogControlsLayout'], sourceImportPaths: ['@/components/products/canonical/CatalogControlsLayout'],
  role: 'catalog-controls-layout', slotTarget: 'controls', requiredClasses: ['flex', 'items-center', 'gap-3', 'md:gap-4'],
};
export function CatalogControlsLayoutView({ controls }: CatalogControlsLayoutViewProps) { return <CatalogControlsLayout controls={controls?.(puckTransparentSlotProps)} />; }
