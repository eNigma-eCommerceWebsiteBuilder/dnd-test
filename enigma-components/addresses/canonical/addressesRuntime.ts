import { getUserProfile } from '@/lib/api/services/users/profile';
import type { User } from '@/lib/api/types/auth';

export interface AddressesPageData { user: User; }

// Keep the route's profile fetch, logging, and error propagation unchanged.
export async function fetchAddressesPageData(): Promise<AddressesPageData> {
  try {
    return { user: await getUserProfile() };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}
