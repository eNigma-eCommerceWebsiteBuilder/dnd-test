export enum AnalyticsEventType {
  PAGE_VIEW = 'page_view',
  PRODUCT_VIEW = 'product_view',
  ADD_TO_CART = 'add_to_cart',
  REMOVE_FROM_CART = 'remove_from_cart',
  CHECKOUT_STARTED = 'checkout_started',
  CHECKOUT_COMPLETED = 'checkout_completed',
  PURCHASE = 'purchase',
  SEARCH = 'search',
  SEARCH_CLICK = 'search_click',
  LIVE_VISITOR_PING = 'live_visitor_ping',
}

export interface UtmParams {
  source?: string | null;
  medium?: string | null;
  campaign?: string | null;
  term?: string | null;
  content?: string | null;
}

export interface DeviceInfo {
  type?: 'desktop' | 'tablet' | 'mobile';
  browser?: string;
  os?: string;
  screenSize?: string;
}

export interface AnalyticsEventData {
  [key: string]: unknown;
}

export interface AnalyticsEvent {
  eventType: AnalyticsEventType;
  sessionId: string;
  visitorId: string;
  timestamp?: string;
  data?: AnalyticsEventData;
  utm?: UtmParams;
  device?: DeviceInfo;
}

export interface AnalyticsBatchRequest {
  events: AnalyticsEvent[];
}

export interface AnalyticsTrackResponse {
  success: true;
  type?: 'ping';
}

export interface AnalyticsBatchResponse {
  success: true;
  processed: number;
}
