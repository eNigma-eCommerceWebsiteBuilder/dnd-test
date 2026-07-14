export interface UserAddress {
  _id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  emailVerified: boolean;
  addresses?: UserAddress[];
  company?: string;
  role?: 'customer' | 'admin';
  createdAt: string;
  lastLogin?: string;
  updatedAt?: string;
}

export interface UpdateUserProfileRequest {
  phone?: string;
}

export type UpdateUserProfileResponse = User;

export interface AddAddressRequest {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

export interface AddAddressResponse {
  success: true;
  data: UserAddress[];
}

export interface DeleteAddressResponse {
  success: true;
  data: UserAddress[];
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  code?: string;
  validationErrors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface MessageResponse {
  success: true;
  message: string;
}
