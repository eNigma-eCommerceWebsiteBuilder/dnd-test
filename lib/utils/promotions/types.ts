export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isExpired: boolean;
}

export enum TimeRemainingFormat {
  FULL = 'full',
  SHORT = 'short',
  COMPACT = 'compact',
}

export type TimeRemainingFormatValue = `${TimeRemainingFormat}`;

export enum PromotionUrgency {
  NONE = 'none',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}
