export interface PuckRouteMetadata {
  pageSlug?: string;
  routeParams?: Record<string, string | string[] | undefined>;
  searchParams?: Record<string, string | string[] | undefined>;
  requestCookies?: string;
}

export interface PuckFetcherContext {
  metadata?: PuckRouteMetadata;
}

export function getRouteParam(
  context: PuckFetcherContext | undefined,
  key: string,
): string | undefined {
  const value = context?.metadata?.routeParams?.[key];
  return Array.isArray(value) ? value[0] : value;
}

export function getSearchParam(
  context: PuckFetcherContext | undefined,
  key: string,
): string | undefined {
  const value = context?.metadata?.searchParams?.[key];
  return Array.isArray(value) ? value[0] : value;
}

export function getNumberSearchParam(
  context: PuckFetcherContext | undefined,
  key: string,
  fallback: number,
): number {
  const raw = getSearchParam(context, key);
  const parsed = raw ? Number(raw) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function getBooleanSearchParam(
  context: PuckFetcherContext | undefined,
  key: string,
): boolean | undefined {
  const raw = getSearchParam(context, key);
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  return undefined;
}
