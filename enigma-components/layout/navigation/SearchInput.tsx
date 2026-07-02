'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils/cn';

interface SearchInputProps {
    className?: string;
    suggestions?: string[];
    onSearch?: (query: string) => void;
}

export const SearchInput = ({ className, suggestions = [], onSearch }: SearchInputProps) => {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handler = window.setTimeout(() => {
            if (onSearch) {
                onSearch(query.trim());
            }
        }, 250);

        return () => window.clearTimeout(handler);
    }, [onSearch, query]);

    const filteredSuggestions = suggestions.filter((item) =>
        item.toLowerCase().includes(query.trim().toLowerCase())
    );

    return (
        <div className={cn("@container relative w-full", className)}>
            <div className="flex items-center gap-2 bg-input-bg rounded-input px-3 py-2 border border-transparent focus-within:border-border-focus transition-colors">
                <span className="material-symbols-outlined text-text-muted text-lg">search</span>
                <input
                    type="text"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    onFocus={() => setIsOpen(true)}
                    onBlur={() => setIsOpen(false)}
                    placeholder="Search collections..."
                    className="w-full bg-transparent border-none outline-none text-sm text-text-base placeholder:text-input-placeholder"
                />
            </div>

            {isOpen && query.trim().length > 0 ? (
                <div className="absolute left-0 right-0 mt-2 rounded-dropdown border border-border bg-bg-surface shadow-dropdown overflow-hidden">
                    {filteredSuggestions.length > 0 ? (
                        <ul className="py-2">
                            {filteredSuggestions.map((item) => (
                                <li key={item} className="px-4 py-2 text-sm text-text-base hover:bg-bg-hover">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="px-4 py-3 text-sm text-text-muted">No suggestions found</div>
                    )}
                </div>
            ) : null}
        </div>
    );
};
