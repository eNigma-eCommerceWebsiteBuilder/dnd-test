'use client';

import { useState, useCallback } from 'react';
import { addAddressAction, deleteAddressAction } from '@/lib/actions/auth/mutation-actions';
import { getErrorMessage } from '@/lib/hooks/internal/errors';
import { buildAddressFormData } from './form-data';
import { useUserProfile } from './useUserProfile';
import type { AddAddressData, UseUserAddressesReturn } from './types';

export function useUserAddresses(): UseUserAddressesReturn {
  const { profile, refreshProfile } = useUserProfile();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addresses = profile?.addresses || [];
  const defaultAddress = addresses.find((address) => address.isDefault) || null;

  const addAddress = useCallback(async (address: AddAddressData) => {
    try {
      setLoading(true);
      setError(null);

      const result = await addAddressAction(null, buildAddressFormData(address));
      if (!result.success) {
        throw new Error(result.error || 'Failed to add address. Please try again.');
      }

      await refreshProfile();
    } catch (error: unknown) {
      const message = getErrorMessage(error, 'Failed to add address. Please try again.');
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [refreshProfile]);

  const deleteAddress = useCallback(async (addressId: string) => {
    try {
      setLoading(true);
      setError(null);

      const result = await deleteAddressAction(addressId);
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete address. Please try again.');
      }

      await refreshProfile();
    } catch (error: unknown) {
      const message = getErrorMessage(error, 'Failed to delete address. Please try again.');
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [refreshProfile]);

  const refreshAddresses = useCallback(async () => {
    await refreshProfile();
  }, [refreshProfile]);

  return {
    addresses,
    defaultAddress,
    loading,
    error,
    addAddress,
    deleteAddress,
    refreshAddresses,
  };
}
