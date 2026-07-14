'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';

interface TabItem {
  id: string;
  label: string;
  content: string;
}

interface ProductTabsClientProps {
  defaultTab?: string;
  tabs: TabItem[];
  className?: string;
}

export function ProductTabsClient({ defaultTab, tabs, className }: ProductTabsClientProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  if (!tabs || tabs.length === 0) return null;

  const activeContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <div className={cn('@container', className)}>
      <div className="flex gap-8 @md:gap-12 border-b border-border mb-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'pb-4 text-sm font-bold uppercase tracking-widest whitespace-nowrap transition-colors',
              activeTab === tab.id
                ? 'border-b-2 border-primary text-primary'
                : 'text-text-muted hover:text-text-base',
            )}
            role="tab"
            aria-selected={activeTab === tab.id}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="animate-fade-in">
        <p className="text-sm leading-relaxed text-text-muted whitespace-pre-line">
          {activeContent}
        </p>
      </div>
    </div>
  );
}
