import { auth } from '@/auth';
import { AccountIdentitySessionDetails } from '@/enigma-components/account/AccountIdentitySessionDetails';

interface RuntimeSessionDetails {
  fullName: string;
  email?: string | null;
  emailVerified?: boolean | Date | null;
}

interface Props {
  fullName?: string;
  email?: string;
  emailVerified?: boolean;
  runtimeSession?: RuntimeSessionDetails;
}

export const puckComponentName = 'AccountIdentitySessionDetails';
export const puckLabel = 'Account Identity Session Details';
export const puckCategory = 'Account';
export const puckFields = {
  fullName: { type: 'text' as const, label: 'Preview display name' },
  email: { type: 'text' as const, label: 'Preview email' },
  emailVerified: {
    type: 'radio' as const,
    label: 'Preview verification state',
    options: [
      { label: 'Verified', value: true },
      { label: 'Managed externally', value: false },
    ],
  },
};
export const puckDefaults = {
  fullName: 'Avery Morgan',
  email: 'avery@example.com',
  emailVerified: true,
};
export const puckAst = {
  kind: 'runtime',
  sourceJsxNames: ['AccountIdentitySessionDetails'],
  sourceImportPaths: ['@/components/account/AccountIdentitySessionDetails'],
  role: 'account-identity-session-details',
  slotTarget: 'details',
  conditional: 'session.user.emailVerified',
  runtimeSignals: ['session.user.firstName', 'session.user.lastName', 'session.user.name', 'session.user.email', 'session.user.emailVerified'],
};

export async function puckDataFetcher() {
  const session = await auth();
  const fullName =
    [session?.user?.firstName, session?.user?.lastName].filter(Boolean).join(' ') ||
    session?.user?.name ||
    'Customer';

  return {
    runtimeSession: {
      fullName,
      email: session?.user?.email,
      emailVerified: session?.user?.emailVerified,
    },
  };
}

export function AccountIdentitySessionDetailsView({
  fullName = 'Avery Morgan',
  email = 'avery@example.com',
  emailVerified = true,
  runtimeSession,
}: Props) {
  const details = runtimeSession ?? { fullName, email, emailVerified };
  return <AccountIdentitySessionDetails {...details} />;
}
