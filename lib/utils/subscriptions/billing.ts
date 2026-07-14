import {
  SubscriptionBillingIntervalCode,
  type BillingInterval,
  type SubscriptionContract,
} from '@/lib/api/types/subscriptions';

export function calculateNextBillingDate(subscription: SubscriptionContract): Date {
  if (!subscription.billingPolicy) {
    throw new Error('Invalid subscription object');
  }

  if (subscription.nextBillingDate) {
    return new Date(subscription.nextBillingDate);
  }

  const { interval, intervalCount } = subscription.billingPolicy;
  const nextDate = new Date(subscription.createdAt);

  switch (interval) {
    case SubscriptionBillingIntervalCode.DAY:
      nextDate.setDate(nextDate.getDate() + intervalCount);
      break;
    case SubscriptionBillingIntervalCode.WEEK:
      nextDate.setDate(nextDate.getDate() + intervalCount * 7);
      break;
    case SubscriptionBillingIntervalCode.MONTH:
      nextDate.setMonth(nextDate.getMonth() + intervalCount);
      break;
    case SubscriptionBillingIntervalCode.YEAR:
      nextDate.setFullYear(nextDate.getFullYear() + intervalCount);
      break;
  }

  return nextDate;
}

export function formatBillingInterval(
  interval: BillingInterval,
  frequency: number = 1,
): string {
  if (frequency === 1) {
    const singleLabels: Record<BillingInterval, string> = {
      [SubscriptionBillingIntervalCode.DAY]: 'Daily',
      [SubscriptionBillingIntervalCode.WEEK]: 'Weekly',
      [SubscriptionBillingIntervalCode.MONTH]: 'Monthly',
      [SubscriptionBillingIntervalCode.YEAR]: 'Yearly',
    };

    return singleLabels[interval];
  }

  const pluralLabels: Record<BillingInterval, string> = {
    [SubscriptionBillingIntervalCode.DAY]: 'days',
    [SubscriptionBillingIntervalCode.WEEK]: 'weeks',
    [SubscriptionBillingIntervalCode.MONTH]: 'months',
    [SubscriptionBillingIntervalCode.YEAR]: 'years',
  };

  return `Every ${frequency} ${pluralLabels[interval]}`;
}
