type AuthSession = {
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    firstName?: string;
    lastName?: string;
    emailVerified?: boolean | Date | null;
  } | null;
} | null;

export const handlers = {};

export async function auth(): Promise<AuthSession> {
  return null;
}

export async function signIn() {
  throw new Error('Authentication provider is not configured in dnd-test.');
}

export async function signOut() {
  return undefined;
}
