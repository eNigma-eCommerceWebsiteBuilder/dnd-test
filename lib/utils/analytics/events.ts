import type {
  AnalyticsEvent,
  AnalyticsEventData,
  AnalyticsEventType,
  DeviceInfo,
  UtmParams,
} from '@/lib/api/types/analytics';
import { getDeviceInfo, getSessionId, getVisitorId } from './session';

export function parseUtmParams(searchParams: URLSearchParams | string): UtmParams {
  const params =
    typeof searchParams === 'string'
      ? new URLSearchParams(searchParams)
      : searchParams;

  return {
    source: params.get('utm_source'),
    medium: params.get('utm_medium'),
    campaign: params.get('utm_campaign'),
    term: params.get('utm_term'),
    content: params.get('utm_content'),
  };
}

export function buildAnalyticsEvent(
  eventType: AnalyticsEventType,
  data: AnalyticsEventData = {},
  options: {
    sessionId?: string | null;
    visitorId?: string | null;
    utm?: UtmParams;
    device?: DeviceInfo;
  } = {},
): AnalyticsEvent | null {
  const sessionId = options.sessionId ?? getSessionId();
  const visitorId = options.visitorId ?? getVisitorId();

  if (!sessionId || !visitorId) {
    return null;
  }

  return {
    eventType,
    sessionId,
    visitorId,
    timestamp: new Date().toISOString(),
    data,
    utm: options.utm,
    device: options.device ?? getDeviceInfo(),
  };
}

export function sanitizeAnalyticsData(
  data: AnalyticsEventData,
): AnalyticsEventData {
  const sensitiveKeys = [
    'password',
    'token',
    'secret',
    'apikey',
    'creditcard',
    'cvv',
    'ssn',
  ];

  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => {
      const lowerKey = key.toLowerCase();
      const isSensitive = sensitiveKeys.some((sensitiveKey) =>
        lowerKey.includes(sensitiveKey),
      );

      if (isSensitive) {
        return [key, '[REDACTED]'];
      }

      if (value && typeof value === 'object' && !Array.isArray(value)) {
        return [key, sanitizeAnalyticsData(value as Record<string, unknown>)];
      }

      return [key, value];
    }),
  );
}
