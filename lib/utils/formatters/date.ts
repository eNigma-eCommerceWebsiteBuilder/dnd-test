export function formatDate(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {},
  locale: string = 'en-US',
): string {
  if (!date) {
    return '';
  }

  const value = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(value.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'long',
    ...options,
  }).format(value);
}

export function formatRelativeTime(
  date: string | Date,
  locale: string = 'en-US',
): string {
  if (!date) {
    return '';
  }

  const value = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(value.getTime())) {
    return '';
  }

  const diffMs = Date.now() - value.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (diffYear > 0) return formatter.format(-diffYear, 'year');
  if (diffMonth > 0) return formatter.format(-diffMonth, 'month');
  if (diffWeek > 0) return formatter.format(-diffWeek, 'week');
  if (diffDay > 0) return formatter.format(-diffDay, 'day');
  if (diffHour > 0) return formatter.format(-diffHour, 'hour');
  if (diffMin > 0) return formatter.format(-diffMin, 'minute');
  return formatter.format(-diffSec, 'second');
}
