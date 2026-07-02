import {
  validateCity,
  validateName,
  validatePostalCode,
  validateShippingAddress,
  validateState,
  validateStreetAddress,
} from '@/lib/utils/validation';

export interface AddressFormData {
  fullName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export type AddressFormField = keyof AddressFormData;
export type AddressFormTouchedState = Partial<Record<AddressFormField, boolean>>;

export const DEFAULT_ADDRESS_FORM_DATA: AddressFormData = {
  fullName: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'US',
  phone: '',
};

const ADDRESS_FORM_FIELDS: AddressFormField[] = [
  'fullName',
  'addressLine1',
  'addressLine2',
  'city',
  'state',
  'postalCode',
  'country',
  'phone',
];

export function createInitialAddressFormData(
  initialData: Partial<AddressFormData>,
): AddressFormData {
  return {
    ...DEFAULT_ADDRESS_FORM_DATA,
    ...initialData,
  };
}

export function createTouchedAddressFields(): AddressFormTouchedState {
  return ADDRESS_FORM_FIELDS.reduce<AddressFormTouchedState>((allTouched, field) => {
    allTouched[field] = true;
    return allTouched;
  }, {});
}

export function validateAddressFormField(
  field: AddressFormField,
  formData: AddressFormData,
): string | null {
  switch (field) {
    case 'fullName': {
      const result = validateName(formData.fullName);
      return result.valid ? null : result.error;
    }
    case 'addressLine1': {
      const result = validateStreetAddress(formData.addressLine1);
      return result.valid ? null : result.error;
    }
    case 'city': {
      const result = validateCity(formData.city);
      return result.valid ? null : result.error;
    }
    case 'state': {
      const result = validateState(formData.state);
      return result.valid ? null : result.error;
    }
    case 'postalCode': {
      const result = validatePostalCode(formData.postalCode, formData.country);
      return result.valid ? null : result.error;
    }
    default:
      return null;
  }
}

export function validateAddressForm(formData: AddressFormData) {
  return validateShippingAddress(formData);
}
