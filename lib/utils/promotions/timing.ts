import type { Promotion } from '@/lib/api/types/promotions';
import type { TimeRemaining } from './types';

export function calculateTimeRemaining(
  endDate: string | Date,
  currentTime: number = Date.now(),
): TimeRemaining {
  const endTime = typeof endDate === 'string' ? new Date(endDate).getTime() : endDate.getTime();
  const remaining = endTime - currentTime;

  if (remaining <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      isExpired: true,
    };
  }

  const totalSeconds = Math.floor(remaining / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds / 3600) % 24),
    minutes: Math.floor((totalSeconds / 60) % 60),
    seconds: totalSeconds % 60,
    totalSeconds,
    isExpired: false,
  };
}

export function isPromotionActive(
  promotion: Promotion | null,
  currentTime: number = Date.now(),
): boolean {
  if (!promotion) {
    return false;
  }

  const startTime = promotion.startDate ? new Date(promotion.startDate).getTime() : 0;
  const endTime = new Date(promotion.endDate).getTime();
  return currentTime >= startTime && currentTime < endTime;
}
