import {
  SubscriptionStatusCode,
  type SubscriptionContract,
  type SubscriptionStatus,
} from '@/lib/api/types/subscriptions';

export interface StatusDisplay {
  text: string;
  color: string;
  badge: string;
  description: string;
  canModify: boolean;
}

const STATUS_DISPLAY_MAP: Record<SubscriptionStatus, StatusDisplay> = {
  [SubscriptionStatusCode.ACTIVE]: {
    text: 'Active',
    color: 'green',
    badge: 'success',
    description: 'Your subscription is active',
    canModify: true,
  },
  [SubscriptionStatusCode.PAUSED]: {
    text: 'Paused',
    color: 'yellow',
    badge: 'warning',
    description: 'Subscription is temporarily paused',
    canModify: true,
  },
  [SubscriptionStatusCode.CANCELLED]: {
    text: 'Cancelled',
    color: 'red',
    badge: 'danger',
    description: 'Subscription has been cancelled',
    canModify: false,
  },
  [SubscriptionStatusCode.EXPIRED]: {
    text: 'Expired',
    color: 'gray',
    badge: 'secondary',
    description: 'Subscription has expired',
    canModify: false,
  },
};

export function formatSubscriptionStatus(status: SubscriptionStatus): StatusDisplay {
  return STATUS_DISPLAY_MAP[status];
}

export function canModifySubscription(subscription: SubscriptionContract): boolean {
  return (
    subscription.status === SubscriptionStatusCode.ACTIVE ||
    subscription.status === SubscriptionStatusCode.PAUSED
  );
}
