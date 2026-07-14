import {
  DEFAULT_AUTH_RETURN_URL,
  DEFAULT_SIGN_OUT_RETURN_URL,
  normalizeReturnUrl,
} from './return-url';

type RedirectOptions = {
  redirectTo: string;
};

export const AUTH_PROVIDER_ID = 'keycloak';

// Keycloak will ignore unknown hints, so this remains safe even if registration
// is exposed via the default login page in some environments.
export const KEYCLOAK_SIGNUP_AUTHORIZATION_PARAMS = {
  screen_hint: 'signup',
} satisfies Record<string, string>;

export function getLoginOptions(
  redirectTo?: string | null
): RedirectOptions {
  return {
    redirectTo: normalizeReturnUrl(redirectTo, DEFAULT_AUTH_RETURN_URL),
  };
}

export function getRegisterOptions(
  redirectTo?: string | null
): RedirectOptions {
  return getLoginOptions(redirectTo);
}

export function getRegisterAuthorizationParams(): Record<string, string> {
  return KEYCLOAK_SIGNUP_AUTHORIZATION_PARAMS;
}

export function getLogoutOptions(
  redirectTo?: string | null
): RedirectOptions {
  return {
    redirectTo: normalizeReturnUrl(redirectTo, DEFAULT_SIGN_OUT_RETURN_URL),
  };
}
