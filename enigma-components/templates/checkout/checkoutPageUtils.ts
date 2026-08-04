import { PaymentMethodId } from '@/lib/api/types/payments';
import { PAYMENT_METHODS } from '@/lib/utils/constants';
import type { PaymentMethodOption } from '@/enigma-components/checkout/PaymentMethodSelector';
import type { AddressFormData } from '@/enigma-components/checkout/AddressForm';
import type { ShippingAddress } from '@/lib/hooks';

export const CHECKOUT_PAYMENT_METHODS: PaymentMethodOption[] = PAYMENT_METHODS
  .filter(({ value }) => value === PaymentMethodId.STRIPE || value === PaymentMethodId.PAYPAL)
  .map(({ value, label }) => ({
    id: value,
    name: label,
    icon: value === PaymentMethodId.PAYPAL ? 'account_balance_wallet' : 'credit_card',
  }));

export function toAddressFormData(
  address: ShippingAddress | null | undefined,
): AddressFormData | undefined {
  if (!address) {
    return undefined;
  }

  return {
    fullName: address.fullName || '',
    addressLine1: address.addressLine1 || '',
    addressLine2: address.addressLine2 || '',
    city: address.city || '',
    state: address.state || '',
    postalCode: address.postalCode || '',
    country: address.country || 'US',
    phone: address.phone || '',
  };
}

export function getPaymentMethodLabel(paymentMethodId: string): string {
  return CHECKOUT_PAYMENT_METHODS.find((method) => method.id === paymentMethodId)?.name || 'Payment';
}
