import type { Address, SubscriptionStatus } from '@/lib/api/types';
import {
  SubscriptionStatusCode,
} from '@/lib/api/types';
import type { FieldErrors, FormDataOrObject } from '@/lib/actions/types';
import {
  getBooleanField,
  getIntegerField,
  getTrimmedStringField,
} from '@/lib/actions/internal/forms';

export enum SubscriptionFieldKey {
  SUBSCRIPTION_ID = 'subscriptionId',
  DRAFT_ID = 'draftId',
  PRODUCT_ID = 'productId',
  VARIANT_ID = 'variantId',
  LINE_ID = 'lineId',
  QUANTITY = 'quantity',
  REASON = 'reason',
  NOTE = 'note',
  RESUME_AT = 'resumeAt',
  IMMEDIATE = 'immediate',
  PAYMENT_METHOD_ID = 'paymentMethodId',
  RETURN_URL = 'returnUrl',
  ADDRESS = 'address',
}

const REQUIRED_ADDRESS_FIELDS: ReadonlyArray<keyof Address> = [
  'street',
  'city',
  'zipCode',
  'country',
];

export const SUBSCRIPTION_UNSUPPORTED_MESSAGES = {
  billingPortal:
    'Subscription billing portal is backed by a documented STUB customer API and is not production-ready.',
  paymentMethod:
    'Subscription payment-method updates are backed by a documented STUB customer API and are not production-ready.',
  skipNext:
    'Skip-next-delivery is backed by a documented STUB customer API and is not production-ready.',
} as const;

export function getFormString<T extends object>(
  input: FormDataOrObject<T>,
  key: string,
): string | undefined {
  return getTrimmedStringField(input, key);
}

export function getFormQuantity<T extends object>(
  input: FormDataOrObject<T>,
): number | undefined {
  return getIntegerField(input, SubscriptionFieldKey.QUANTITY);
}

export function getFormBoolean<T extends object>(
  input: FormDataOrObject<T>,
  key: string,
): boolean | undefined {
  return getBooleanField(input, key);
}

export function parseAddress<T extends object>(
  input: FormDataOrObject<T>,
  key: string = SubscriptionFieldKey.ADDRESS,
): Address | undefined {
  if (input instanceof FormData) {
    const rawValue = input.get(key);
    if (typeof rawValue !== 'string' || !rawValue.trim()) {
      return undefined;
    }

    return JSON.parse(rawValue) as Address;
  }

  const rawValue = input[key as keyof T];
  if (typeof rawValue === 'string') {
    return rawValue.trim() ? (JSON.parse(rawValue) as Address) : undefined;
  }

  return rawValue as Address | undefined;
}

export function validateAddress(address: Address | undefined): FieldErrors {
  const fieldErrors: FieldErrors = {};

  if (!address) {
    fieldErrors[SubscriptionFieldKey.ADDRESS] = 'A complete address is required.';
    return fieldErrors;
  }

  for (const field of REQUIRED_ADDRESS_FIELDS) {
    if (!address[field]) {
      fieldErrors[SubscriptionFieldKey.ADDRESS] = 'A complete address is required.';
      break;
    }
  }

  return fieldErrors;
}

export function isSubscriptionStatus(value: string | undefined): value is SubscriptionStatus {
  if (!value) {
    return false;
  }

  return (Object.values(SubscriptionStatusCode) as string[]).includes(value);
}
