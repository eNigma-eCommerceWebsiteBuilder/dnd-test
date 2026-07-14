import { auth } from '@/auth';
import type { AddAddressRequest } from '@/lib/api/types';
import type { FieldErrors } from '@/lib/actions/types';

export type AddressField = keyof AddAddressRequest;

export async function requireAuthenticatedSession(): Promise<void> {
  const session = await auth();

  if (!session?.user) {
    throw new Error('Authentication required');
  }
}

export function getAddressFieldErrors(
  address: AddAddressRequest,
): FieldErrors<AddressField> {
  const fieldErrors: FieldErrors<AddressField> = {};

  if (!address.street) {
    fieldErrors.street = 'Street is required';
  }

  if (!address.city) {
    fieldErrors.city = 'City is required';
  }

  if (!address.state) {
    fieldErrors.state = 'State is required';
  }

  if (!address.zipCode) {
    fieldErrors.zipCode = 'ZIP code is required';
  }

  if (!address.country) {
    fieldErrors.country = 'Country is required';
  }

  return fieldErrors;
}
