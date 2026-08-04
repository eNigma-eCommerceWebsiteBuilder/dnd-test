import { loadAccountWishlistRuntime } from './accountWishlistRuntime.server';

// Loaded only by the generated RSC config. Client Puck Views use seed preview data.
export async function puckDataFetcher() {
  return loadAccountWishlistRuntime();
}
