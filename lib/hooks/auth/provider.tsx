'use client';

import { createContext, type ReactNode, useMemo } from 'react';
import type { AuthContextValue } from './types';

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
  session?: unknown;
}) {
  const value = useMemo<AuthContextValue>(
    () => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      authEnabled: false,
      tokenExpiresAt: null,
      login: async (redirectTo?: string) => {
        void redirectTo;
        throw new Error('Authentication provider is not configured in dnd-test.');
      },
      register: async (redirectTo?: string) => {
        void redirectTo;
        throw new Error('Authentication provider is not configured in dnd-test.');
      },
      logout: async (redirectTo?: string) => {
        void redirectTo;
      },
      refreshUser: async () => undefined,
      checkUser: async () => undefined,
      clearError: () => undefined,
    }),
    [],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
