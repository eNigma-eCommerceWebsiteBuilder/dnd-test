'use client';

import { useState, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface Tab {
    id: string;
    label: string;
    content: ReactNode;
}

interface ProductTabsProps {
    tabs: Tab[];
    defaultTab?: string;
    className?: string;
}

/**
 * ProductTabs Component (Client)
 * 
 * Tabbed content area following LUXE design:
 * - Description/Specs/Reviews tabs
 * - Underline style for active tab
 */
export function ProductTabs({ tabs, defaultTab, className }: ProductTabsProps) {
    const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

    if (!tabs || tabs.length === 0) {
        return null;
    }

    const activeContent = tabs.find(tab => tab.id === activeTab)?.content;

    return (
        <div className={cn("@container", className)}>
            {/* Tab Headers */}
            <div className="flex gap-8 @md:gap-12 border-b border-border mb-8 overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "pb-4 text-sm font-bold uppercase tracking-widest whitespace-nowrap transition-colors",
                            activeTab === tab.id
                                ? "border-b-2 border-primary text-primary"
                                : "text-text-muted hover:text-text-base"
                        )}
                        role="tab"
                        aria-selected={activeTab === tab.id}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div role="tabpanel" className="animate-fade-in">
                {activeContent}
            </div>
        </div>
    );
}

export default ProductTabs;
