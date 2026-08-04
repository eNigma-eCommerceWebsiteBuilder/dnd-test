import { SharedWishlistHeaderActionsCondition } from './SharedWishlistHeaderActionsCondition';
import { loadSharedWishlistRuntime } from './sharedWishlistRuntime';
import { puckTransparentSlotProps, type WishlistSlot } from './types';

interface Props {
  visible?: boolean;
  previewMode?: 'visible' | 'hidden';
  content?: WishlistSlot;
  puck?: { isEditing?: boolean };
}

export const puckComponentName = 'SharedWishlistHeaderActionsCondition';
export const puckLabel = 'Shared Wishlist Header Actions Condition';
export const puckCategory = 'Wishlist';
export const puckFields = {
  previewMode: { type: 'select' as const, options: [{ label: 'Visible', value: 'visible' }, { label: 'Hidden', value: 'hidden' }] },
  content: { type: 'slot' as const, allow: ['SharedWishlistAddAll'] },
};
export const puckDefaults = { previewMode: 'visible', content: [] };
export const puckAst = {
  kind: 'runtime',
  slots: ['content'],
  sourceJsxNames: ['SharedWishlistHeaderActionsCondition'],
  sourceImportPaths: ['@/components/wishlist/canonical/SharedWishlistHeaderActionsCondition'],
  role: 'shared-wishlist-header-actions-condition',
  slotTarget: 'actions',
  conditional: 'items.length > 0',
  runtimeSignals: ['wishlist.items'],
};
export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadSharedWishlistRuntime>[0]) { const runtime = await loadSharedWishlistRuntime(context); return { visible: runtime.items.length > 0 }; }
export function SharedWishlistHeaderActionsConditionView({ visible, previewMode = 'visible', content, puck }: Props) {
  const resolved = puck?.isEditing ? previewMode === 'visible' : visible ?? false;
  return <SharedWishlistHeaderActionsCondition visible={resolved} content={content?.(puckTransparentSlotProps)} />;
}
