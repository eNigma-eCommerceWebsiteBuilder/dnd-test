interface CurrencyInfo {
  symbol: string;
  name: string;
  code: string;
}

export const CURRENCIES: Record<string, CurrencyInfo> = {
  USD: { symbol: '$', name: 'US Dollar', code: 'USD' },
  EUR: { symbol: 'EUR', name: 'Euro', code: 'EUR' },
  GBP: { symbol: 'GBP', name: 'British Pound', code: 'GBP' },
  JPY: { symbol: 'JPY', name: 'Japanese Yen', code: 'JPY' },
  INR: { symbol: 'INR', name: 'Indian Rupee', code: 'INR' },
  CAD: { symbol: 'C$', name: 'Canadian Dollar', code: 'CAD' },
  AUD: { symbol: 'A$', name: 'Australian Dollar', code: 'AUD' },
};

export const DEFAULT_CURRENCY = 'USD' as const;
export type CurrencyCode = keyof typeof CURRENCIES;

interface Country {
  code: string;
  name: string;
}

export const COUNTRIES: Country[] = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'IN', name: 'India' },
  { code: 'JP', name: 'Japan' },
];
