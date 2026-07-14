'use server';

import { revalidatePath } from 'next/cache';
import {
  addUserAddress as apiAddAddress,
  deleteUserAddress as apiDeleteAddress,
  updateUserProfile as apiUpdateProfile,
} from '@/lib/api';
import type { AddAddressRequest, UserAddress } from '@/lib/api/types';
import {
  createErrorResult,
  createSuccessResult,
  getActionErrorMessage,
} from '@/lib/actions/internal/errors';
import {
  getBooleanField,
  getTrimmedStringField,
} from '@/lib/actions/internal/forms';
import { getActionRequestContext } from '@/lib/actions/internal/request';
import type { ActionResult, ActionState, UserProfile } from '@/lib/actions/types';
import {
  type AddressField,
  getAddressFieldErrors,
  requireAuthenticatedSession,
} from './shared';

export async function updateProfileAction(
  prevState: ActionState<UserProfile>,
  formData: FormData,
): Promise<ActionResult<UserProfile, 'phone'>> {
  void prevState;

  try {
    await requireAuthenticatedSession();

    const phone = getTrimmedStringField(formData, 'phone');
    const profile = await apiUpdateProfile(
      {
        ...(phone ? { phone } : {}),
      },
      await getActionRequestContext(),
    );

    revalidatePath('/account');

    return createSuccessResult(profile, {
      message: 'Profile updated successfully',
    });
  } catch (error: unknown) {
    return createErrorResult(getActionErrorMessage(error, 'Failed to update profile'));
  }
}

export async function addAddressAction(
  prevState: ActionState<UserAddress[]>,
  formData: FormData,
): Promise<ActionResult<UserAddress[], AddressField>> {
  void prevState;

  try {
    await requireAuthenticatedSession();

    const address: AddAddressRequest = {
      street: getTrimmedStringField(formData, 'street') ?? '',
      city: getTrimmedStringField(formData, 'city') ?? '',
      state: getTrimmedStringField(formData, 'state') ?? '',
      zipCode: getTrimmedStringField(formData, 'zipCode') ?? '',
      country: getTrimmedStringField(formData, 'country') ?? '',
      isDefault: getBooleanField(formData, 'isDefault'),
    };

    const fieldErrors = getAddressFieldErrors(address);
    if (Object.keys(fieldErrors).length > 0) {
      return createErrorResult('Please complete the required address fields', {
        fieldErrors,
      });
    }

    const addresses = await apiAddAddress(address, await getActionRequestContext());
    revalidatePath('/account/addresses');

    return createSuccessResult(addresses, {
      message: 'Address added successfully',
    });
  } catch (error: unknown) {
    return createErrorResult(getActionErrorMessage(error, 'Failed to add address'));
  }
}

export async function deleteAddressAction(
  addressId: string,
): Promise<ActionResult<UserAddress[]>> {
  try {
    await requireAuthenticatedSession();
    const addresses = await apiDeleteAddress(addressId, await getActionRequestContext());

    revalidatePath('/account/addresses');

    return createSuccessResult(addresses, {
      message: 'Address deleted successfully',
    });
  } catch (error: unknown) {
    return createErrorResult(getActionErrorMessage(error, 'Failed to delete address'));
  }
}
