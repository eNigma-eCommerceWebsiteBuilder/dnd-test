import { cn } from '@/lib/utils/cn';

interface SuccessHeaderViewProps {
  title: string;
  className?: string;
}

export const puckComponentName = 'SuccessHeader';
export const puckLabel = 'Success Header';
export const puckCategory = 'Checkout';

export const puckFields = {
  title: { type: 'text' as const, label: 'Title' },
};

export const puckDefaults = {
  title: 'Thank you for your order',
};

export function SuccessHeaderView({ title, className }: SuccessHeaderViewProps) {
  return (
    <div className={cn('@container flex flex-col items-center text-center', className)}>
      <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-success-subtle @md:mb-6 @md:size-20">
        <span className="material-symbols-outlined text-4xl font-bold text-success @md:text-5xl">
          check_circle
        </span>
      </div>
      <h1 className="text-2xl font-heading font-bold tracking-tight text-text-base @md:text-3xl @lg:text-4xl">
        {title}
      </h1>
    </div>
  );
}
