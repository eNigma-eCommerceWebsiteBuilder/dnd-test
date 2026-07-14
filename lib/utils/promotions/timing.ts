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

export function isPromotionExpiringSoon(
  promotion: Promotion | null,
  hoursThreshold: number = 24,
  currentTime: number = Date.now(),
): boolean {
  if (!promotion?.endDate) {
    return false;
  }

  const remaining = new Date(promotion.endDate).getTime() - currentTime;
  return remaining > 0 && remaining <= hoursThreshold * 60 * 60 * 1000;
}

export function getPromotionProgress(
  promotion: Promotion | null,
  currentTime: number = Date.now(),
): number {
  if (!promotion?.startDate || !promotion.endDate) {
    return 0;
  }

  const startTime = new Date(promotion.startDate).getTime();
  const endTime = new Date(promotion.endDate).getTime();
  const duration = endTime - startTime;
  const elapsed = currentTime - startTime;

  if (elapsed <= 0) return 0;
  if (elapsed >= duration) return 100;
  return Math.round((elapsed / duration) * 100);
}
