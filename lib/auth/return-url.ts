export const DEFAULT_AUTH_RETURN_URL = '/account';
export const DEFAULT_SIGN_OUT_RETURN_URL = '/';

export type AuthMode = 'login' | 'register';

export function normalizeReturnUrl(
  value: string | null | undefined,
  fallback = DEFAULT_AUTH_RETURN_URL
) {
  if (!value) {
    return fallback;
  }

  if (!value.startsWith('/')) {
    return fallback;
  }

  if (value.startsWith('//')) {
    return fallback;
  }

  return value;
}

export function buildReturnUrl(pathname: string, search = '') {
  return normalizeReturnUrl(`${pathname}${search}`);
}

export function buildAuthPath(
  returnUrl?: string | null,
  mode: AuthMode = 'login'
) {
  const normalizedReturnUrl = normalizeReturnUrl(returnUrl);
  const searchParams = new URLSearchParams();

  searchParams.set('returnUrl', normalizedReturnUrl);

  if (mode === 'register') {
    searchParams.set('mode', mode);
  }

  return `/auth?${searchParams.toString()}`;
}
