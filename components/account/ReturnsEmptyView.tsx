import { cn } from '@/lib/utils/cn';

interface ReturnsEmptyViewProps {
  title?: string;
  message?: string;
  className?: string;
}

export const puckComponentName = 'ReturnsEmpty';
export const puckLabel = 'Returns Empty State';
export const puckCategory = 'Account';

export const puckFields = {
  title: { type: 'text' as const, label: 'Title' },
  message: { type: 'textarea' as const, label: 'Message' },
};

export const puckDefaults = {
  title: 'No Returns Yet',
  message: 'Your return requests will appear here once you submit them.',
};

export function ReturnsEmptyView({ title = '', message = '', className }: ReturnsEmptyViewProps) {
  return (
    <div className={cn('@container flex flex-col items-center justify-center text-center py-12 @md:py-16', className)}>
      <div className="w-20 h-20 @md:w-24 @md:h-24 rounded-full bg-bg-sunken flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-4xl @md:text-5xl text-text-muted">undo</span>
      </div>
      <h2 className="text-xl @md:text-2xl font-bold text-text-base mb-2">{title}</h2>
      <p className="text-sm @md:text-base text-text-muted max-w-md">{message}</p>
    </div>
  );
}
