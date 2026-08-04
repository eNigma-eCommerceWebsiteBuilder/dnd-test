import type { AddressesPageData } from '@/enigma-components/addresses/canonical/addressesRuntime';

export const addressesPreview: AddressesPageData = {
  user: {
    _id: 'puck-addresses-preview',
    firstName: 'Avery',
    lastName: 'Morgan',
    email: 'avery@example.com',
    emailVerified: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    addresses: [{
      _id: 'puck-address-preview',
      street: '100 Market Street',
      city: 'Karachi',
      state: 'Sindh',
      zipCode: '75500',
      country: 'Pakistan',
      isDefault: true,
    }],
  },
};
