import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

interface ViewDetailsButtonProps {
    href: string;
    className?: string;
}

export function ViewDetailsButton({ href, className }: ViewDetailsButtonProps) {
    return (
        <Link
            href={href}
            className={cn(
                '@container w-full inline-flex items-center justify-center gap-2 rounded-button px-4 py-2 text-sm font-semibold bg-primary text-on-primary shadow-button hover:bg-primary-dark hover:shadow-button-hover transition-all',
                className
            )}
        >
            <span className="material-symbols-outlined text-lg">open_in_new</span>
            View details
        </Link>
    );
}
