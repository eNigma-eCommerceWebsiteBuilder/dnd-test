export type { User, UserAddress } from '@/lib/api/types/auth';

import type { User, UserAddress } from '@/lib/api/types/auth';

export interface AuthUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  name?: string | null;
  image?: string | null;
}

export interface UseAuthReturn {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  authEnabled: boolean;
  tokenExpiresAt: number | null;
  login: (redirectTo?: string) => Promise<void>;
  register: (redirectTo?: string) => Promise<void>;
  logout: (redirectTo?: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  checkUser: () => Promise<void>;
  clearError: () => void;
}

export interface ProfileUpdateData {
  phone?: string;
}

export interface UseUserProfileReturn {
  profile: User | null;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
}

export interface UseUpdateProfileReturn {
  updateProfile: (data: ProfileUpdateData) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
  reset: () => void;
}

export interface AddAddressData {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

export interface UseUserAddressesReturn {
  addresses: UserAddress[];
  defaultAddress: UserAddress | null;
  loading: boolean;
  error: string | null;
  addAddress: (address: AddAddressData) => Promise<void>;
  deleteAddress: (addressId: string) => Promise<void>;
  refreshAddresses: () => Promise<void>;
}

export type AuthContextValue = UseAuthReturn;
