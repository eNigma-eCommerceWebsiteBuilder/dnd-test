import type { AddAddressData, ProfileUpdateData } from './types';

export function buildProfileFormData(data: ProfileUpdateData): FormData {
  const formData = new FormData();

  if (data.phone) {
    formData.append('phone', data.phone);
  }

  return formData;
}

export function buildAddressFormData(address: AddAddressData): FormData {
  const formData = new FormData();

  formData.append('street', address.street);
  formData.append('city', address.city);
  formData.append('state', address.state);
  formData.append('zipCode', address.zipCode);
  formData.append('country', address.country);
  formData.append('isDefault', String(Boolean(address.isDefault)));

  return formData;
}
