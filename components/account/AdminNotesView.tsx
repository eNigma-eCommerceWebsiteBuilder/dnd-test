import { cn } from '@/lib/utils/cn';

interface AdminNotesViewProps {
  notes?: string;
  className?: string;
}

export const puckComponentName = 'AdminNotes';
export const puckLabel = 'Admin Notes';
export const puckCategory = 'Account';

export const puckFields = {
  notes: { type: 'textarea' as const, label: 'Admin Notes' },
};

export const puckDefaults = {
  notes: 'Customer contacted support regarding damaged packaging. Approved for full refund pending item return.',
};

export function AdminNotesView({ notes = '', className }: AdminNotesViewProps) {
  if (!notes) return null;

  return (
    <div className={cn('@container bg-bg-surface rounded-card p-4 @md:p-6 shadow-card border border-border', className)}>
      <div className="flex items-center gap-2 mb-3">
        <span className="material-symbols-outlined text-primary">edit_note</span>
        <h3 className="text-sm @md:text-base font-bold text-text-base">Admin Notes</h3>
      </div>
      <p className="text-sm text-text-muted leading-relaxed whitespace-pre-wrap">{notes}</p>
    </div>
  );
}
