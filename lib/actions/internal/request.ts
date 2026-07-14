import { getServerRequestContext } from '@/lib/api/core/server';

export async function getActionRequestContext() {
  return getServerRequestContext();
}
