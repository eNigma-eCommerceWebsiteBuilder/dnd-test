export interface ValidationResult {
  valid: boolean;
  error: string | null;
}

export interface ShippingAddress {
  fullName?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
}

export interface ValidationErrors {
  [key: string]: string;
}

export interface AddressValidationResult {
  valid: boolean;
  errors: ValidationErrors;
}
