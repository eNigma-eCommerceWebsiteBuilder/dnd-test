export function maskLicenseKey(licenseKey: string, visibleChars: number = 4): string {
  if (!licenseKey || licenseKey.length <= visibleChars * 2) {
    return licenseKey ?? '';
  }

  const start = licenseKey.slice(0, visibleChars);
  const end = licenseKey.slice(-visibleChars);
  const middleLength = licenseKey.length - visibleChars * 2;
  return `${start}${'*'.repeat(Math.min(middleLength, 12))}${end}`;
}

export function isValidLicenseKeyFormat(licenseKey: string): boolean {
  return Boolean(licenseKey) && licenseKey.length >= 8 && /^[A-Za-z0-9-]+$/.test(licenseKey);
}
