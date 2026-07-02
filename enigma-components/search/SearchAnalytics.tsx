'use client';

import { useEffect } from 'react';
import { useSearchTracking } from '@/lib/analytics';

interface SearchAnalyticsProps {
    query: string;
    resultCount: number;
}

/**
 * SearchAnalytics Component - Client Component
 * 
 * Tracks search queries for analytics.
 * Uses useSearchTracking hook as specified in PAGE_AND_COMPONENTS_PLAN.md.
 */
export function SearchAnalytics({ query, resultCount }: SearchAnalyticsProps) {
  const trackSearch = useSearchTracking();

  useEffect(() => {
    if (!query.trim()) {
      return;
    }

    trackSearch(query, resultCount);
  }, [query, resultCount, trackSearch]);

  return null;
}

export default SearchAnalytics;
