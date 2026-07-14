'use client';

import { useState, useCallback, useEffect } from 'react';
import { getProfileAction } from '@/lib/actions/auth/query-actions';
import { updateProfileAction } from '@/lib/actions/auth/mutation-actions';
import { getErrorMessage } from '@/lib/hooks/internal/errors';
import { buildProfileFormData } from './form-data';
import { useAuth } from './useAuth';
import type {
  User,
  ProfileUpdateData,
  UseUserProfileReturn,
  UseUpdateProfileReturn,
} from './types';

export function useUserProfile(autoFetch: boolean = true): UseUserProfileReturn {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getProfileAction();

      if (!result.success || !result.data) {
        setError(result.error || 'Failed to load profile. Please try again.');
        return;
      }

      setProfile(result.data);
    } catch (error: unknown) {
      setError(getErrorMessage(error, 'Failed to load profile. Please try again.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!autoFetch) {
      return;
    }

    let cancelled = false;

    queueMicrotask(() => {
      if (!cancelled) {
        void refreshProfile();
      }
    });

    return () => {
      cancelled = true;
    };
  }, [autoFetch, refreshProfile]);

  return {
    profile,
    loading,
    error,
    refreshProfile,
  };
}

export function useUpdateProfile(): UseUpdateProfileReturn {
  const { refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const updateProfile = useCallback(async (data: ProfileUpdateData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const result = await updateProfileAction(null, buildProfileFormData(data));

      if (!result.success) {
        setError(result.error || 'Failed to update profile. Please try again.');
        return;
      }

      setSuccess(true);
      await refreshUser();
    } catch (error: unknown) {
      setError(getErrorMessage(error, 'Failed to update profile. Please try again.'));
    } finally {
      setLoading(false);
    }
  }, [refreshUser]);

  const reset = useCallback(() => {
    setError(null);
    setSuccess(false);
  }, []);

  return {
    updateProfile,
    loading,
    error,
    success,
    reset,
  };
}
