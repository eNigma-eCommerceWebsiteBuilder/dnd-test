export function formatNumber(
  value: number,
  options: Intl.NumberFormatOptions = {},
  locale: string = 'en-US',
): string {
  if (!Number.isFinite(value)) {
    return '';
  }

  return new Intl.NumberFormat(locale, options).format(value);
}

export function formatCompact(value: number, locale: string = 'en-US'): string {
  return formatNumber(value, { notation: 'compact' }, locale);
}

export function formatPercent(
  value: number,
  decimals: number = 0,
  locale: string = 'en-US',
): string {
  return formatNumber(
    value / 100,
    {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    },
    locale,
  );
}
