export function EmptyDownloads() {
    return (
        <div className="@container w-full rounded-card border border-border bg-bg-surface p-8 text-center shadow-card">
            <div className="mx-auto max-w-md space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-text-muted">No downloads</p>
                <h2 className="text-2xl font-heading font-bold text-text-base">Your library is empty</h2>
                <p className="text-sm text-text-muted">
                    Digital purchases and license details will appear here once available.
                </p>
            </div>
        </div>
    );
}
