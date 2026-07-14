'use client';

import { ReactNode, createContext, useContext } from 'react';
import type { Product } from '@/lib/api/types';

interface AnalyticsContextValue {
  trackEvent: (eventType: string, data: unknown) => Promise<void>;
  trackEvents: (events: unknown[]) => Promise<void>;
  clearSession: () => void;
}

const noopAsync = async () => {};

const AnalyticsContext = createContext<AnalyticsContextValue>({
  trackEvent: noopAsync,
  trackEvents: noopAsync,
  clearSession: () => {},
});

const analyticsValue: AnalyticsContextValue = {
  trackEvent: noopAsync,
  trackEvents: noopAsync,
  clearSession: () => {},
};

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  return <AnalyticsContext.Provider value={analyticsValue}>{children}</AnalyticsContext.Provider>;
}

export function useAnalytics() {
  return useContext(AnalyticsContext);
}

// Keeps production product components callable while analytics remains intentionally inert in the testbed.
export function useProductView(_product: Product | null | undefined): void {}

export function ProductImpressionTracker({
  children,
}: {
  children: ReactNode;
  listName?: string;
}) {
  return <>{children}</>;
}

export const AnalyticsInteraction = {
  PRODUCT_IMPRESSION: 'product_impression',
  PRODUCT_CLICK: 'product_click',
  PAGE_VIEW: 'page_view',
} as const;
