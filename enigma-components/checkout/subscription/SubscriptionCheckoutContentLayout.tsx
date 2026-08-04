import type { ReactNode } from 'react';
import SubscriptionCheckoutLayout from './SubscriptionCheckoutLayout';

interface Props { header: ReactNode; steps: ReactNode; leftColumn: ReactNode; rightColumn: ReactNode; }

export default function SubscriptionCheckoutContentLayout({ header, steps, leftColumn, rightColumn }: Props) {
  return <SubscriptionCheckoutLayout header={header} steps={steps} leftColumn={<div className="space-y-10">{leftColumn}</div>} rightColumn={<div className="space-y-6 @lg:sticky @lg:top-28">{rightColumn}</div>} />;
}
