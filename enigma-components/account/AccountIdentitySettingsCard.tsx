import type { ReactNode } from 'react';

interface AccountIdentitySettingsCardProps {
  explanation: ReactNode;
  details: ReactNode;
}

export function AccountIdentitySettingsCard({ explanation, details }: AccountIdentitySettingsCardProps) {
  return (
    <section className="mt-8 overflow-hidden rounded-card border border-border bg-bg-surface shadow-card">
      <div className="grid grid-cols-1 gap-8 p-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:p-10">
        {explanation}
        {details}
      </div>
    </section>
  );
}
