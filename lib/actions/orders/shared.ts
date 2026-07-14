import type {
  Address,
  ExchangeItem,
  OrderCreateData,
  OrderUpdateData,
} from '@/lib/api/types';
import type {
  FieldErrors,
  FormDataOrObject,
} from '@/lib/actions/types';
import {
  getTrimmedStringField,
  normalizeEmail,
} from '@/lib/actions/internal/forms';
import { normalizePaymentMethod } from '@/lib/actions/internal/payments';

export enum OrderFieldKey {
  ORDER_ID = 'orderId',
  EXCHANGE_ID = 'exchangeId',
  CUSTOMER_NAME = 'customerName',
  CUSTOMER_EMAIL = 'customerEmail',
  PAYMENT_METHOD = 'paymentMethod',
  EMAIL = 'email',
  REASON = 'reason',
  BILLING_ADDRESS = 'billingAddress',
  STREET = 'street',
  CITY = 'city',
  STATE = 'state',
  ZIP_CODE = 'zipCode',
  COUNTRY = 'country',
  PHONE = 'phone',
}

const SHIPPING_FIELD_KEYS = [
  OrderFieldKey.STREET,
  OrderFieldKey.CITY,
  OrderFieldKey.STATE,
  OrderFieldKey.ZIP_CODE,
  OrderFieldKey.COUNTRY,
  OrderFieldKey.PHONE,
] as const;

type ShippingFieldKey = (typeof SHIPPING_FIELD_KEYS)[number];

function getObjectStringValue<T extends object>(
  source: T,
  key: string,
): string | undefined {
  const rawValue = source[key as keyof T];

  return typeof rawValue === 'string' ? rawValue.trim() || undefined : undefined;
}

export function getStringValue<T extends object>(
  source: FormDataOrObject<T>,
  key: string,
): string | undefined {
  return source instanceof FormData
    ? getTrimmedStringField(source, key)
    : getObjectStringValue(source, key);
}

export function getEmailValue<T extends object>(
  source: FormDataOrObject<T>,
  key: string,
): string | undefined {
  const value = getStringValue(source, key);
  return value ? normalizeEmail(value) : undefined;
}

export function parseJsonValue<TValue, TObject extends object>(
  source: FormDataOrObject<TObject>,
  key: string,
): TValue | undefined {
  const rawValue =
    source instanceof FormData ? source.get(key) : source[key as keyof TObject];
  if (rawValue === undefined || rawValue === null || rawValue === '') {
    return undefined;
  }

  if (typeof rawValue === 'string') {
    return rawValue.trim() ? (JSON.parse(rawValue) as TValue) : undefined;
  }

  return rawValue as TValue;
}

export function getExchangeItems<T extends object>(
  source: FormDataOrObject<T>,
  key: string,
): ExchangeItem[] | undefined {
  return parseJsonValue<ExchangeItem[], T>(source, key);
}

export function buildAddress<T extends object>(
  source: FormDataOrObject<T>,
): Partial<Address> | undefined {
  const values = SHIPPING_FIELD_KEYS.reduce<Partial<Record<ShippingFieldKey, string>>>(
    (result, fieldKey) => {
      const fieldValue = getStringValue(source, fieldKey);

      if (fieldValue) {
        result[fieldKey] = fieldValue;
      }

      return result;
    },
    {},
  );

  if (Object.keys(values).length === 0) {
    return undefined;
  }

  return {
    street: values.street,
    city: values.city,
    state: values.state,
    zipCode: values.zipCode,
    country: values.country,
    phone: values.phone,
  };
}

export function validateAddressFields(
  address: Partial<Address>,
  errors: FieldErrors,
): void {
  if (!address.street) {
    errors[OrderFieldKey.STREET] = 'Street address is required.';
  }
  if (!address.city) {
    errors[OrderFieldKey.CITY] = 'City is required.';
  }
  if (!address.zipCode) {
    errors[OrderFieldKey.ZIP_CODE] = 'ZIP code is required.';
  }
  if (!address.country) {
    errors[OrderFieldKey.COUNTRY] = 'Country is required.';
  }
}

export function buildCreateOrderPayload(
  formData: FormData,
): { data?: OrderCreateData; fieldErrors?: FieldErrors } {
  const customerName = getStringValue(formData, OrderFieldKey.CUSTOMER_NAME);
  const customerEmail = getEmailValue(formData, OrderFieldKey.CUSTOMER_EMAIL);
  const paymentMethod = normalizePaymentMethod(
    getStringValue(formData, OrderFieldKey.PAYMENT_METHOD),
  );
  const shippingAddress = buildAddress(formData);
  const fieldErrors: FieldErrors = {};

  if (!customerName) {
    fieldErrors[OrderFieldKey.CUSTOMER_NAME] = 'Name is required.';
  }
  if (!customerEmail) {
    fieldErrors[OrderFieldKey.CUSTOMER_EMAIL] = 'Email is required.';
  }
  if (!paymentMethod) {
    fieldErrors[OrderFieldKey.PAYMENT_METHOD] = 'A supported payment method is required.';
  }
  if (shippingAddress) {
    validateAddressFields(shippingAddress, fieldErrors);
  }

  if (Object.keys(fieldErrors).length > 0 || !customerName || !customerEmail || !paymentMethod) {
    return { fieldErrors };
  }

  return {
    data: {
      customerName,
      customerEmail,
      paymentMethod,
      shippingAddress: shippingAddress as Address | undefined,
      phone: shippingAddress?.phone,
    },
  };
}

export function buildOrderUpdatePayload<T extends object>(
  formData: FormDataOrObject<T>,
): OrderUpdateData | undefined {
  const shippingAddress = buildAddress(formData);
  const phone = getStringValue(formData, OrderFieldKey.PHONE);

  if (!shippingAddress && !phone) {
    return undefined;
  }

  return {
    ...(shippingAddress ? { shippingAddress } : {}),
    ...(phone ? { phone } : {}),
  };
}
