import { SharedWishlistSavingsCard } from './SharedWishlistSavingsCard';
import { loadSharedWishlistRuntime } from './sharedWishlistRuntime';
interface Props { potentialValue?: number; totalSavings?: number; puck?: { isEditing?: boolean }; }
export const puckComponentName = 'SharedWishlistSavingsCard';
export const puckLabel = 'Shared Wishlist Savings Card';
export const puckCategory = 'Wishlist';
export const puckFields = {};
export const puckDefaults = { potentialValue: 180, totalSavings: 25 };
export const puckAst = { kind: 'runtime', sourceJsxNames: ['SharedWishlistSavingsCard'], sourceImportPaths: ['@/components/wishlist/canonical/SharedWishlistSavingsCard'], role: 'shared-wishlist-savings-card', runtimeSignals: ['wishlist.items'] };
export async function puckDataFetcher(_props: Props, context?: Parameters<typeof loadSharedWishlistRuntime>[0]) { const runtime = await loadSharedWishlistRuntime(context); return runtime.savings; }
export function SharedWishlistSavingsCardView({ potentialValue = 0, totalSavings = 0, puck }: Props) { return <SharedWishlistSavingsCard potentialValue={puck?.isEditing && potentialValue === 0 ? 180 : potentialValue} totalSavings={puck?.isEditing && totalSavings === 0 ? 25 : totalSavings} />; }
