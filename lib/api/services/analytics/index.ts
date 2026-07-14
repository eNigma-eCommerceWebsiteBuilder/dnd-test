import { apiMutate, API_BASE_URL, WEBSITE_ID } from '../../core/client';
import type {
    AnalyticsEvent,
    AnalyticsBatchRequest,
    AnalyticsTrackResponse,
    AnalyticsBatchResponse,
} from '../../types';

export async function trackEvent(
    event: AnalyticsEvent,
    options: { useBeacon?: boolean } = {}
): Promise<AnalyticsTrackResponse> {
    const { useBeacon = false } = options;

    if (useBeacon && !WEBSITE_ID && typeof navigator !== 'undefined' && navigator.sendBeacon) {
        const url = `${API_BASE_URL}/analytics/track`;
        const blob = new Blob([JSON.stringify(event)], { type: 'application/json' });

        const sent = navigator.sendBeacon(url, blob);

        if (sent) {
            return { success: true };
        }
    }

    return apiMutate<AnalyticsTrackResponse>('/analytics/track', {
        method: 'POST',
        body: event,
    });
}

export async function trackBatchEvents(
    events: AnalyticsEvent[],
    options: { useBeacon?: boolean } = {}
): Promise<AnalyticsBatchResponse> {
    const { useBeacon = false } = options;
    const requestBody: AnalyticsBatchRequest = { events };

    if (useBeacon && !WEBSITE_ID && typeof navigator !== 'undefined' && navigator.sendBeacon) {
        const url = `${API_BASE_URL}/analytics/batch`;
        const blob = new Blob([JSON.stringify(requestBody)], { type: 'application/json' });

        const sent = navigator.sendBeacon(url, blob);

        if (sent) {
            return { success: true, processed: events.length };
        }
    }

    return apiMutate<AnalyticsBatchResponse>('/analytics/batch', {
        method: 'POST',
        body: requestBody,
    });
}
