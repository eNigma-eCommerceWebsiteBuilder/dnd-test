import { auth } from '@/auth';

export interface AccountDashboardData {
  firstName: string;
  email?: string | null;
}

// Preserve the route's hosted-identity session lookup and greeting fallback.
export async function fetchAccountDashboardData(): Promise<AccountDashboardData> {
  const session = await auth();

  return {
    firstName: session?.user?.firstName || session?.user?.name || 'there',
    email: session?.user?.email,
  };
}
