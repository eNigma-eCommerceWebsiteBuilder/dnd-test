import { redirect } from 'next/navigation';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';
import { getSearchParam } from '@/lib/puck-route-metadata';
import { resolveAuthPageRuntime } from '@/enigma-components/auth/canonical/AuthPageState';

// Puck's RSC renderer receives route search params through metadata, rather
// than Next's native page props. The underlying auth decision remains shared.
export async function enforceAuthPageRuntime(context?: PuckFetcherContext) {
  const runtime = await resolveAuthPageRuntime({
    returnUrl: getSearchParam(context, 'returnUrl'),
  });

  if (runtime.redirectTo) {
    redirect(runtime.redirectTo);
  }

  return {};
}
