import { cn } from '@/lib/utils/cn';

interface ReturnPolicyReminderViewProps {
  title?: string;
  returnWindowDays?: number;
  restockingFeePercent?: number;
  className?: string;
}

export const puckComponentName = 'ReturnPolicyReminder';
export const puckLabel = 'Return Policy Reminder';
export const puckCategory = 'Account';

export const puckFields = {
  title: { type: 'text' as const, label: 'Title' },
  returnWindowDays: { type: 'number' as const, label: 'Return Window (days)' },
  restockingFeePercent: { type: 'number' as const, label: 'Restocking Fee (%)' },
};

export const puckDefaults = {
  title: 'Return Policy',
  returnWindowDays: 30,
  restockingFeePercent: 0,
};

export function ReturnPolicyReminderView({ title = 'Return Policy', returnWindowDays = 30, restockingFeePercent = 0, className }: ReturnPolicyReminderViewProps) {
  return (
    <div className={cn('@container bg-bg-surface rounded-card p-4 @md:p-6 border border-border', className)}>
      <div className="flex items-center gap-2 mb-3">
        <span className="material-symbols-outlined text-primary">info</span>
        <h3 className="text-sm @md:text-base font-bold text-text-base">{title}</h3>
      </div>
      <div className="text-sm text-text-muted leading-relaxed space-y-2">
        <p>You can return items within <strong className="text-text-base">{returnWindowDays} days</strong> of delivery.</p>
        {restockingFeePercent > 0 && (
          <p>A <strong className="text-text-base">{restockingFeePercent}%</strong> restocking fee may apply to certain items.</p>
        )}
        <p>Items must be in original condition with tags attached. Refunds are processed to the original payment method.</p>
      </div>
    </div>
  );
}
