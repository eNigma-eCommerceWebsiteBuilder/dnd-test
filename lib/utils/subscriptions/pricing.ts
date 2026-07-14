import {
  SubscriptionBillingIntervalCode,
  type SellingPlan,
  type SubscriptionContract,
} from '@/lib/api/types';
import { calculateNextBillingDate, formatBillingInterval } from './billing';

export interface SavingsInfo {
  amount: number;
  percentage: number;
  period: string;
  annualSavings: number;
}

export function calculateSubscriptionSavings(
  sellingPlan: SellingPlan,
  quantity: number = 1,
  oneTimePrice?: number,
): SavingsInfo {
  const subscriptionPrice = sellingPlan.discountedPrice || 0;
  const regularPrice = oneTimePrice || sellingPlan.originalPrice || 0;
  const perItemSavings = regularPrice - subscriptionPrice;
  const totalSavings = perItemSavings * quantity;
  const percentage = regularPrice > 0 ? (perItemSavings / regularPrice) * 100 : 0;
  const interval = sellingPlan.billingPolicy.interval;
  const intervalCount = sellingPlan.billingPolicy.intervalCount || 1;

  const billingPerYearMap = {
    [SubscriptionBillingIntervalCode.DAY]: 365 / intervalCount,
    [SubscriptionBillingIntervalCode.WEEK]: 52 / intervalCount,
    [SubscriptionBillingIntervalCode.MONTH]: 12 / intervalCount,
    [SubscriptionBillingIntervalCode.YEAR]: 1 / intervalCount,
  };

  const annualSavings = totalSavings * billingPerYearMap[interval];

  return {
    amount: Math.round(totalSavings * 100) / 100,
    percentage: Math.round(percentage * 10) / 10,
    period: formatBillingInterval(interval, intervalCount),
    annualSavings: Math.round(annualSavings * 100) / 100,
  };
}

export interface ProrationInfo {
  creditAmount: number;
  chargeAmount: number;
  netAmount: number;
  daysRemaining: number;
  description: string;
}

export function calculateProration(
  subscription: SubscriptionContract,
  newTotal: number,
): ProrationInfo {
  const currentTotal = subscription.totalPrice || 0;
  const nextBillingDate = calculateNextBillingDate(subscription);
  const now = new Date();
  const daysRemaining = Math.max(
    0,
    Math.floor((nextBillingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
  );

  const estimatedLastBillingDate = new Date(nextBillingDate);
  const { interval, intervalCount } = subscription.billingPolicy;

  switch (interval) {
    case SubscriptionBillingIntervalCode.DAY:
      estimatedLastBillingDate.setDate(estimatedLastBillingDate.getDate() - intervalCount);
      break;
    case SubscriptionBillingIntervalCode.WEEK:
      estimatedLastBillingDate.setDate(estimatedLastBillingDate.getDate() - intervalCount * 7);
      break;
    case SubscriptionBillingIntervalCode.MONTH:
      estimatedLastBillingDate.setMonth(estimatedLastBillingDate.getMonth() - intervalCount);
      break;
    case SubscriptionBillingIntervalCode.YEAR:
      estimatedLastBillingDate.setFullYear(estimatedLastBillingDate.getFullYear() - intervalCount);
      break;
  }

  const totalDays = Math.floor(
    (nextBillingDate.getTime() - estimatedLastBillingDate.getTime()) /
      (1000 * 60 * 60 * 24),
  );
  const unusedCredit = totalDays > 0 ? (currentTotal / totalDays) * daysRemaining : 0;
  const newCharge = totalDays > 0 ? (newTotal / totalDays) * daysRemaining : 0;
  const netAmount = newCharge - unusedCredit;

  const description =
    netAmount > 0
      ? `You will be charged $${Math.abs(netAmount).toFixed(2)} for the remaining ${daysRemaining} days`
      : netAmount < 0
        ? `You will receive a credit of $${Math.abs(netAmount).toFixed(2)} for the remaining ${daysRemaining} days`
        : 'No additional charge or credit';

  return {
    creditAmount: Math.round(unusedCredit * 100) / 100,
    chargeAmount: Math.round(newCharge * 100) / 100,
    netAmount: Math.round(netAmount * 100) / 100,
    daysRemaining,
    description,
  };
}
