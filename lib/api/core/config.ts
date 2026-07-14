export const API_BASE_URL = typeof window === 'undefined'
  ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api'
  : '/api/backend';
export const WEBSITE_ID = process.env.WEBSITE_ID || process.env.NEXT_PUBLIC_WEBSITE_ID;
export const DEFAULT_TIMEOUT = 30000;
