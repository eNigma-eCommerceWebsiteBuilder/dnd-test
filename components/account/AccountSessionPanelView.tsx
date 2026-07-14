import type { ReactNode } from 'react';

interface AccountSessionPanelViewProps {
  state?: string;
  signedIn?: (props?: Record<string, unknown>) => ReactNode;
  signedOut?: (props?: Record<string, unknown>) => ReactNode;
}

export const puckComponentName = 'AccountSessionPanel';
export const puckLabel = 'Account Session Panel';
export const puckCategory = 'Account';

export const puckFields = {
  state: {
    type: 'select' as const,
    label: 'Preview State',
    options: [
      { label: 'Signed In', value: 'signed-in' },
      { label: 'Signed Out', value: 'signed-out' },
    ],
  },
  signedIn: { type: 'slot' as const },
  signedOut: { type: 'slot' as const },
};

export const puckDefaults = {
  state: 'signed-in',
};

export const puckAst = {
  kind: 'runtime',
  topLevel: true,
  slots: ['signedIn', 'signedOut'],
  runtimeSignals: ['session'],
  matches: [
    { pageIncludes: ['app/account'], component: 'AccountSessionPanel' },
  ],
};

export function AccountSessionPanelView({ state = 'signed-in', signedIn, signedOut }: AccountSessionPanelViewProps) {
  return <>{state === 'signed-out' ? signedOut?.() : signedIn?.()}</>;
}
