import Link from 'next/link';

export function ReturnNotFound() {
    return (
        <section className="@container w-full rounded-card border border-border bg-surface p-6 shadow-card flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-danger-subtle flex items-center justify-center">
                <span className="material-symbols-outlined text-danger">error</span>
            </div>
            <h2 className="text-lg font-bold text-text-base">Return Not Found</h2>
            <p className="text-sm text-text-muted max-w-md">
                We couldn&apos;t find the return you&apos;re looking for. Please check the link or view all returns.
            </p>
            <Link
                href="/account/returns"
                className="px-4 py-2 rounded-button bg-cta-primary text-on-primary font-semibold hover:bg-cta-primary-hover transition-colors"
            >
                View Returns
            </Link>
        </section>
    );
}
