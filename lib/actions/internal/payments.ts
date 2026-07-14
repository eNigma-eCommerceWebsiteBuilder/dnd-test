import { PaymentMethodId } from '@/lib/api/types';

enum LegacyPaymentMethod {
  CARD = 'card',
  COD = 'cod',
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
}

const PAYMENT_METHOD_ALIASES: Readonly<Record<LegacyPaymentMethod, PaymentMethodId>> = {
  [LegacyPaymentMethod.CARD]: PaymentMethodId.STRIPE,
  [LegacyPaymentMethod.COD]: PaymentMethodId.CASH_ON_DELIVERY,
  [LegacyPaymentMethod.CREDIT_CARD]: PaymentMethodId.STRIPE,
  [LegacyPaymentMethod.DEBIT_CARD]: PaymentMethodId.STRIPE,
};

const BILLING_ADDRESS_REQUIRED_METHODS = new Set<PaymentMethodId>([
  PaymentMethodId.STRIPE,
  PaymentMethodId.APPLE_PAY,
  PaymentMethodId.GOOGLE_PAY,
]);

export function normalizePaymentMethod(
  paymentMethod: string | null | undefined,
): PaymentMethodId | undefined {
  if (!paymentMethod) {
    return undefined;
  }

  const normalizedMethod = paymentMethod.trim().toLowerCase();

  if (normalizedMethod in PAYMENT_METHOD_ALIASES) {
    return PAYMENT_METHOD_ALIASES[normalizedMethod as LegacyPaymentMethod];
  }

  return Object.values(PaymentMethodId).includes(normalizedMethod as PaymentMethodId)
    ? (normalizedMethod as PaymentMethodId)
    : undefined;
}

export function requiresBillingAddress(
  paymentMethod: PaymentMethodId | string | null | undefined,
): boolean {
  const normalizedMethod =
    typeof paymentMethod === 'string'
      ? normalizePaymentMethod(paymentMethod)
      : paymentMethod ?? undefined;

  return normalizedMethod !== undefined && BILLING_ADDRESS_REQUIRED_METHODS.has(normalizedMethod);
}
