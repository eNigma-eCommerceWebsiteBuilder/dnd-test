import type { DeviceInfo } from '@/lib/api/types/analytics';
import { AnalyticsStorageKey, SESSION_TIMEOUT_MS } from './constants';

interface NavigatorWithTracking extends Navigator {
  msDoNotTrack?: string;
}

interface WindowWithTracking extends Window {
  doNotTrack?: string;
}

function createTrackingId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `tracking-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

export function getVisitorId(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    let visitorId = localStorage.getItem(AnalyticsStorageKey.VISITOR_ID);
    if (!visitorId) {
      visitorId = createTrackingId();
      localStorage.setItem(AnalyticsStorageKey.VISITOR_ID, visitorId);
    }
    return visitorId;
  } catch (error: unknown) {
    console.warn('[Analytics] Failed to get visitor ID:', error);
    return null;
  }
}

export function getSessionId(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const now = Date.now();
    let sessionId = sessionStorage.getItem(AnalyticsStorageKey.SESSION_ID);
    const lastActivity = Number.parseInt(
      sessionStorage.getItem(AnalyticsStorageKey.LAST_ACTIVITY) ?? '0',
      10,
    );

    if (!sessionId || now - lastActivity > SESSION_TIMEOUT_MS) {
      sessionId = createTrackingId();
      sessionStorage.setItem(AnalyticsStorageKey.SESSION_ID, sessionId);
    }

    sessionStorage.setItem(AnalyticsStorageKey.LAST_ACTIVITY, now.toString());
    return sessionId;
  } catch (error: unknown) {
    console.warn('[Analytics] Failed to get session ID:', error);
    return null;
  }
}

export function getDeviceInfo(): DeviceInfo {
  if (typeof window === 'undefined') {
    return {
      type: 'desktop',
      browser: 'Unknown',
      os: 'Unknown',
      screenSize: '0x0',
    };
  }

  const width = window.innerWidth;
  const type = width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop';
  const userAgent = navigator.userAgent;
  let browser = 'Other';

  if (userAgent.includes('Chrome')) browser = 'Chrome';
  else if (userAgent.includes('Firefox')) browser = 'Firefox';
  else if (userAgent.includes('Safari')) browser = 'Safari';
  else if (userAgent.includes('Edge')) browser = 'Edge';

  return {
    type,
    browser,
    os: navigator.platform,
    screenSize: `${window.screen.width}x${window.screen.height}`,
  };
}

export function isAnalyticsEnabled(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const windowWithTracking = window as WindowWithTracking;
  const navigatorWithTracking = navigator as NavigatorWithTracking;
  const doNotTrack =
    navigator.doNotTrack ??
    windowWithTracking.doNotTrack ??
    navigatorWithTracking.msDoNotTrack;

  if (doNotTrack === '1' || doNotTrack === 'yes') {
    return false;
  }

  try {
    return localStorage.getItem(AnalyticsStorageKey.CONSENT) !== 'false';
  } catch {
    return true;
  }
}

export function clearAnalyticsSession(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    sessionStorage.removeItem(AnalyticsStorageKey.SESSION_ID);
    sessionStorage.removeItem(AnalyticsStorageKey.LAST_ACTIVITY);
  } catch (error: unknown) {
    console.warn('[Analytics] Failed to clear session:', error);
  }
}
