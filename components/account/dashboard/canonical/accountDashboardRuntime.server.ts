import { cache } from 'react';
import {
  fetchAccountDashboardData,
  type AccountDashboardData,
} from '@/enigma-components/account/dashboard/canonical/accountDashboardRuntime';

const load = cache(async (): Promise<AccountDashboardData> => fetchAccountDashboardData());

export function loadAccountDashboardRuntime(): Promise<AccountDashboardData> {
  return load();
}
