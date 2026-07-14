import type { Promotion } from '@/lib/api/types/promotions';
import {
  PromotionUrgency,
  TimeRemainingFormat,
  type TimeRemainingFormatValue,
  type TimeRemaining,
} from './types';
import { calculateTimeRemaining } from './timing';

export function formatTimeRemaining(
  timeRemaining: TimeRemaining,
  format: TimeRemainingFormatValue = TimeRemainingFormat.SHORT,
): string {
  if (timeRemaining.isExpired) {
    return 'Expired';
  }

  const { days, hours, minutes, seconds } = timeRemaining;

  if (format === TimeRemainingFormat.FULL) {
    const parts: string[] = [];
    if (days > 0) parts.push(`${days} ${days === 1 ? 'day' : 'days'}`);
    if (hours > 0) parts.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
    if (minutes > 0) parts.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);
    if (seconds > 0 && days === 0) {
      parts.push(`${seconds} ${seconds === 1 ? 'second' : 'seconds'}`);
    }
    return parts.join(', ');
  }

  if (format === TimeRemainingFormat.COMPACT) {
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m ${seconds}s`;
  }

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 && days === 0 && hours === 0) parts.push(`${seconds}s`);
  return parts.join(' ');
}

export function getPromotionUrgency(
  promotion: Promotion | null,
  currentTime: number = Date.now(),
): PromotionUrgency {
  if (!promotion?.endDate) {
    return PromotionUrgency.NONE;
  }

  const timeLeft = calculateTimeRemaining(promotion.endDate, currentTime);
  if (timeLeft.isExpired) {
    return PromotionUrgency.NONE;
  }

  const hoursLeft = timeLeft.totalSeconds / 3600;
  if (hoursLeft <= 1) return PromotionUrgency.CRITICAL;
  if (hoursLeft <= 6) return PromotionUrgency.HIGH;
  if (hoursLeft <= 24) return PromotionUrgency.MEDIUM;
  if (hoursLeft <= 72) return PromotionUrgency.LOW;
  return PromotionUrgency.NONE;
}
