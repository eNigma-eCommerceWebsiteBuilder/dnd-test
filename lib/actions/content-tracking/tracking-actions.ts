'use server';

import {
  trackBatchEvents as apiTrackBatchEvents,
  trackEvent as apiTrackEvent,
  type AnalyticsEvent,
} from '@/lib/api';
import {
  createEmptySuccessResult,
  createErrorResult,
  createSuccessResult,
  getActionErrorMessage,
} from '@/lib/actions/internal/errors';
import type { ActionResult, ActionState } from '@/lib/actions/types';

interface BatchProcessedData {
  processed: number;
}

function isAnalyticsEvent(event: unknown): event is AnalyticsEvent {
  if (!event || typeof event !== "object") {
    return false;
  }

  return (
    'eventType' in event &&
    'sessionId' in event &&
    'visitorId' in event &&
    typeof event.eventType === 'string' &&
    typeof event.sessionId === 'string' &&
    typeof event.visitorId === 'string'
  );
}

export async function trackEventAction(
  prevState: ActionState,
  event: AnalyticsEvent,
): Promise<ActionResult> {
  void prevState;

  try {
    if (!isAnalyticsEvent(event)) {
      return createErrorResult('Missing required event fields (eventType, sessionId, visitorId)');
    }

    await apiTrackEvent(event);
    return createEmptySuccessResult({ message: 'Event tracked successfully' });
  } catch (error: unknown) {
    return createErrorResult(getActionErrorMessage(error, 'Failed to track event'));
  }
}

export async function trackBatchEventsAction(
  prevState: ActionState<BatchProcessedData>,
  events: AnalyticsEvent[],
): Promise<ActionResult<BatchProcessedData>> {
  void prevState;

  try {
    if (!Array.isArray(events) || events.length === 0) {
      return createErrorResult('Events array is required and must not be empty');
    }

    if (!events.every(isAnalyticsEvent)) {
      return createErrorResult('All events must have eventType, sessionId, and visitorId');
    }

    const result = await apiTrackBatchEvents(events);
    return createSuccessResult(
      { processed: result.processed },
      { message: `Tracked ${result.processed} events successfully` },
    );
  } catch (error: unknown) {
    return createErrorResult(getActionErrorMessage(error, 'Failed to track events'));
  }
}
