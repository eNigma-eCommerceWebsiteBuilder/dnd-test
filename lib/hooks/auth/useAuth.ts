'use client';

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { buildAuthPath, buildReturnUrl, normalizeReturnUrl } from '@/lib/auth/return-url';
import { AuthContext } from './provider';
import type { AuthContextValue } from './types';

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }

  return context;
}

export function useAuth() {
  return useAuthContext();
}

export function useRequireAuth(redirectTo?: string) {
  const auth = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (auth.loading) return;

    if (!auth.isAuthenticated) {
      const returnUrl = normalizeReturnUrl(
        redirectTo ||
          (typeof window !== 'undefined'
            ? buildReturnUrl(window.location.pathname, window.location.search)
            : undefined)
      );
      router.replace(buildAuthPath(returnUrl));
    }
  }, [auth.isAuthenticated, auth.loading, redirectTo, router]);

  return auth;
}
