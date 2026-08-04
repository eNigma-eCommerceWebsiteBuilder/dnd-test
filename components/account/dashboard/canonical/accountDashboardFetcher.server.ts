import { loadAccountDashboardRuntime } from './accountDashboardRuntime.server';

export async function puckDataFetcher() {
  return loadAccountDashboardRuntime();
}
