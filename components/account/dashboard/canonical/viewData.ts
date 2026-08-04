import type { AccountDashboardData } from '@/enigma-components/account/dashboard/canonical/accountDashboardRuntime';
import { accountDashboardPreview } from './preview';

export interface AccountDashboardRuntimeProps {
  data?: AccountDashboardData | null;
  puck?: { isEditing?: boolean };
}

export function resolveAccountDashboardData({ data = null, puck }: AccountDashboardRuntimeProps): AccountDashboardData | null {
  return puck?.isEditing ? accountDashboardPreview : data;
}
