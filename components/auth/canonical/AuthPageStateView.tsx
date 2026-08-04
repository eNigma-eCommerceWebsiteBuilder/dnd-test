import type { ReactNode } from 'react';
import type { PuckFetcherContext } from '@/lib/puck-route-metadata';
import { enforceAuthPageRuntime } from './authPageRuntime';
type Slot = (() => ReactNode) | undefined;
interface Props { content?: Slot; }

export const puckComponentName = 'AuthPageState';
export const puckLabel = 'Auth Page State';
export const puckCategory = 'Auth';
export const puckFields = {
  content: { type: 'slot' as const, allow: ['AuthPageLayout'] },
};
export const puckDefaults = { content: [] };
export const puckAst = {
  kind: 'runtime',
  topLevel: true,
  slots: ['content'],
  sourceJsxNames: ['AuthPageState'],
  sourceImportPaths: ['@/components/auth/canonical/AuthPageState'],
  role: 'auth-page-state',
  conditional: 'session?.user => redirect(normalizeReturnUrl(searchParams.returnUrl))',
  runtimeSignals: ['session.user', 'searchParams.returnUrl'],
};

export async function puckDataFetcher(
  _props: Props,
  context?: PuckFetcherContext,
) {
  return enforceAuthPageRuntime(context);
}

// The editor always exposes the authored slot tree. Published RSC rendering
// enforces the real authenticated-user redirect before this adapter is called.
export function AuthPageStateView({ content }: Props) {
  return <>{content?.()}</>;
}
