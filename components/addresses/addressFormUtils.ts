import {
  validateStreetAddress,
  validateCity,
  validateState,
  validatePostalCode,
  validateShippingAddress,
} from '@/lib/utils/validation';

export interface AddressFormState {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export const DEFAULT_ADDRESS_FORM_STATE: AddressFormState = {
  street: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
  isDefault: false,
};

export function validateAddressForm(
  fullName: string,
  formState: AddressFormState,
): Record<string, string> {
  const nextErrors: Record<string, string> = {};

  const streetResult = validateStreetAddress(formState.street);
  if (!streetResult.valid && streetResult.error) {
    nextErrors.street = streetResult.error;
  }

  const cityResult = validateCity(formState.city);
  if (!cityResult.valid && cityResult.error) {
    nextErrors.city = cityResult.error;
  }

  const stateResult = validateState(formState.state);
  if (!stateResult.valid && stateResult.error) {
    nextErrors.state = stateResult.error;
  }

  const postalResult = validatePostalCode(formState.zipCode, formState.country);
  if (!postalResult.valid && postalResult.error) {
    nextErrors.zipCode = postalResult.error;
  }

  if (!formState.country) {
    nextErrors.country = 'Country is required';
  }

  const shippingValidation = validateShippingAddress({
    fullName,
    addressLine1: formState.street,
    city: formState.city,
    state: formState.state,
    postalCode: formState.zipCode,
    country: formState.country,
  });

  if (!shippingValidation.valid) {
    if (shippingValidation.errors.addressLine1) {
      nextErrors.street = shippingValidation.errors.addressLine1;
    }
    if (shippingValidation.errors.city) {
      nextErrors.city = shippingValidation.errors.city;
    }
    if (shippingValidation.errors.state) {
      nextErrors.state = shippingValidation.errors.state;
    }
    if (shippingValidation.errors.postalCode) {
      nextErrors.zipCode = shippingValidation.errors.postalCode;
    }
    if (shippingValidation.errors.country) {
      nextErrors.country = shippingValidation.errors.country;
    }
  }

  return nextErrors;
}
