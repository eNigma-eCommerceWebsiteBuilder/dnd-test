import { SharedWishlistPageState } from './SharedWishlistPageState';
import { loadSharedWishlistRuntime } from './sharedWishlistRuntime';
import { puckTransparentSlotProps, type WishlistSlot } from './types';

interface Props {
  valid?: boolean;
  previewMode?: 'content' | 'invalid';
  content?: WishlistSlot;
  invalid?: WishlistSlot;
  puck?: { isEditing?: boolean };
}
export const puckComponentName = 'SharedWishlistPageState';
export const puckLabel = 'Shared Wishlist Page State';
export const puckCategory = 'Wishlist';
export const puckFields = {
  previewMode: { type: 'select' as const, options: [{ label: 'Shared list', value: 'content' }, { label: 'Invalid link', value: 'invalid' }] },
  content: { type: 'slot' as const, allow: ['SharedWishlistPageLayout'] },
  invalid: { type: 'slot' as const, allow: ['SharedWishlistInvalidState'] },
};
export const puckDefaults = { previewMode: 'content', content: [], invalid: [] };
export const puckAst = {
  kind: 'runtime',
  topLevel: true,
  slots: ['content', 'invalid'],
  sourceJsxNames: ['SharedWishlistPageState'],
  sourceImportPaths: ['@/components/wishlist/canonical/SharedWishlistPageState'],
  role: 'shared-wishlist-page-state',
  conditional: 'Boolean(wishlist)',
  runtimeSignals: ['params.token', 'wishlist'],
};
export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadSharedWishlistRuntime>[0]) { const runtime = await loadSharedWishlistRuntime(context); return { valid: Boolean(runtime.wishlist) }; }
export function SharedWishlistPageStateView({ valid, previewMode = 'content', content, invalid, puck }: Props) {
  const resolved = puck?.isEditing ? previewMode === 'content' : valid ?? false;
  return <SharedWishlistPageState valid={resolved} content={content?.(puckTransparentSlotProps)} invalid={invalid?.(puckTransparentSlotProps)} />;
}
