'use server';

import {
  getUserProfile as apiGetProfile,
  type User,
} from '@/lib/api';
import {
  createErrorResult,
  createSuccessResult,
  getActionErrorMessage,
} from '@/lib/actions/internal/errors';
import { getActionRequestContext } from '@/lib/actions/internal/request';
import type { ActionResult } from '@/lib/actions/types';
import { requireAuthenticatedSession } from './shared';

export async function getProfileAction(): Promise<ActionResult<User>> {
  try {
    await requireAuthenticatedSession();
    const profile = await apiGetProfile(await getActionRequestContext());
    return createSuccessResult(profile);
  } catch (error: unknown) {
    return createErrorResult(getActionErrorMessage(error, 'Failed to load profile'));
  }
}
