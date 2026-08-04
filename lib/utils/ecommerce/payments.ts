import { PaymentMethodId } from '@/lib/api/types/payments';

enum LegacyCardMethod {
  CARD = 'card',
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
}

type BillingAddressMethod = PaymentMethodId | `${LegacyCardMethod}`;

const BILLING_ADDRESS_METHODS = new Set<BillingAddressMethod>([
  PaymentMethodId.STRIPE,
  LegacyCardMethod.CARD,
  LegacyCardMethod.CREDIT_CARD,
  LegacyCardMethod.DEBIT_CARD,
]);

const PAYMENT_METHOD_LABELS: Record<BillingAddressMethod | PaymentMethodId, string> = {
  [PaymentMethodId.STRIPE]: 'Credit/Debit Card',
  [PaymentMethodId.PAYPAL]: 'PayPal',
  [PaymentMethodId.APPLE_PAY]: 'Apple Pay',
  [PaymentMethodId.GOOGLE_PAY]: 'Google Pay',
  [PaymentMethodId.BANK_TRANSFER]: 'Bank Transfer',
  [PaymentMethodId.CASH_ON_DELIVERY]: 'Cash on Delivery',
  [LegacyCardMethod.CARD]: 'Credit/Debit Card',
  [LegacyCardMethod.CREDIT_CARD]: 'Credit Card',
  [LegacyCardMethod.DEBIT_CARD]: 'Debit Card',
};

export function requiresBillingAddress(paymentMethod: string): boolean {
  return BILLING_ADDRESS_METHODS.has(paymentMethod as BillingAddressMethod);
}

export function getPaymentMethodLabel(method: string): string {
  return PAYMENT_METHOD_LABELS[method as BillingAddressMethod | PaymentMethodId] || method;
}

export function maskCardNumber(cardNumber: string): string {
  if (!cardNumber) return '';
  const cleaned = cardNumber.replace(/\s/g, '');
  return cleaned.length < 4 ? cleaned : `**** **** **** ${cleaned.slice(-4)}`;
}

export function formatCardExpiry(month: string | number, year: string | number): string {
  if (!month || !year) return '';
  return `${month.toString().padStart(2, '0')}/${year.toString().slice(-2)}`;
}

export function isCardExpired(month: string | number, year: string | number): boolean {
  if (!month || !year) return true;
  const now = new Date();
  const expirationYear = year.toString().length === 2 ? 2000 + Number(year) : Number(year);
  const expirationMonth = Number(month);
  return expirationYear < now.getFullYear()
    || (expirationYear === now.getFullYear() && expirationMonth < now.getMonth() + 1);
}
