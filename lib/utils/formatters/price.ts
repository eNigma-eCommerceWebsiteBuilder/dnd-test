import type { Product as ApiProduct } from '@/lib/api/types/products';

export function formatPrice(
  price: number,
  currency: string = 'USD',
  locale: string = 'en-US',
): string {
  if (!Number.isFinite(price)) {
    return '';
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

export type Product = Pick<ApiProduct, 'price' | 'salePrice' | 'isOnSale'> & {
  originalPrice?: number;
};

export interface FormattedPrice {
  current: string;
  currentValue: number;
  isOnSale: boolean;
  original?: string;
  originalValue?: number;
  discount?: string;
  savings?: string;
}

export function formatProductPrice(
  product: Product,
  currency: string = 'USD',
  locale: string = 'en-US',
): FormattedPrice {
  const { price, salePrice, originalPrice, isOnSale } = product;
  const currentPrice = isOnSale && salePrice ? salePrice : price;
  const originalPriceValue = originalPrice ?? price;
  const onSale = Boolean(isOnSale && salePrice && salePrice < originalPriceValue);

  const result: FormattedPrice = {
    current: formatPrice(currentPrice, currency, locale),
    currentValue: currentPrice,
    isOnSale: onSale,
  };

  if (!onSale || !salePrice) {
    return result;
  }

  return {
    ...result,
    original: formatPrice(originalPriceValue, currency, locale),
    originalValue: originalPriceValue,
    discount: `${Math.round((1 - salePrice / originalPriceValue) * 100)}%`,
    savings: formatPrice(originalPriceValue - salePrice, currency, locale),
  };
}
