import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { normalizeReturnUrl } from '@/lib/auth/return-url';

export interface AuthPageSearchParams {
  returnUrl?: string;
}

export interface AuthPageRuntime {
  redirectTo: string | null;
}

// Keep the testbed's published Puck state aligned with TemplateFrontend.
export async function resolveAuthPageRuntime(
  searchParams: AuthPageSearchParams,
): Promise<AuthPageRuntime> {
  const session = await auth();
  const returnUrl = normalizeReturnUrl(searchParams.returnUrl);

  return {
    redirectTo: session?.user ? returnUrl : null,
  };
}

export async function AuthPageState({
  searchParams,
  content,
}: {
  searchParams: Promise<AuthPageSearchParams>;
  content: ReactNode;
}) {
  const runtime = await resolveAuthPageRuntime(await searchParams);

  if (runtime.redirectTo) {
    redirect(runtime.redirectTo);
  }

  return <>{content}</>;
}
