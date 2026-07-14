export function truncate(text: string, maxLength: number, suffix: string = '...'): string {
  if (!text || text.length <= maxLength) {
    return text ?? '';
  }

  return `${text.slice(0, maxLength - suffix.length).trim()}${suffix}`;
}

export function capitalize(text: string): string {
  if (!text) {
    return '';
  }

  return `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
}

export function slugify(text: string): string {
  if (!text) {
    return '';
  }

  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function formatOrderNumber(orderNumber: string): string {
  if (!orderNumber) {
    return '';
  }

  return orderNumber.startsWith('#') ? orderNumber : `#${orderNumber}`;
}
