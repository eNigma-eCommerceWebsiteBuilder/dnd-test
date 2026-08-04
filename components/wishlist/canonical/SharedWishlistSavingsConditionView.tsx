import { SharedWishlistSavingsCondition } from './SharedWishlistSavingsCondition';
import { loadSharedWishlistRuntime } from './sharedWishlistRuntime';
import { puckTransparentSlotProps, type WishlistSlot } from './types';
interface Props { visible?: boolean; previewMode?: 'visible' | 'hidden'; content?: WishlistSlot; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'SharedWishlistSavingsCondition';
export const puckLabel = 'Shared Wishlist Savings Condition';
export const puckCategory = 'Wishlist';
export const puckFields = { previewMode: { type: 'select' as const, options: [{ label: 'Visible', value: 'visible' }, { label: 'Hidden', value: 'hidden' }] }, content: { type: 'slot' as const, allow: ['SharedWishlistSavingsCard'] } };
export const puckDefaults = { previewMode: 'visible', content: [] };
export const puckAst = { kind: 'runtime', slots: ['content'], sourceJsxNames: ['SharedWishlistSavingsCondition'], sourceImportPaths: ['@/components/wishlist/canonical/SharedWishlistSavingsCondition'], role: 'shared-wishlist-savings-condition', conditional: 'savings.potentialValue > 0', runtimeSignals: ['wishlist.items'] };
export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadSharedWishlistRuntime>[0]) { const runtime = await loadSharedWishlistRuntime(context); return { visible: runtime.savings.potentialValue > 0 }; }
export function SharedWishlistSavingsConditionView({ visible, previewMode = 'visible', content, puck }: Props) { const resolved = puck?.isEditing ? previewMode === 'visible' : visible ?? false; return <SharedWishlistSavingsCondition visible={resolved} content={content?.(puckTransparentSlotProps)} />; }
