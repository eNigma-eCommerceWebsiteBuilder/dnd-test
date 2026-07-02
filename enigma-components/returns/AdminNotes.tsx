interface AdminNotesProps {
    notes: string;
}

export function AdminNotes({ notes }: AdminNotesProps) {
    return (
        <section className="@container w-full rounded-card border border-border bg-surface p-4 shadow-card flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-text-base">Admin Notes</h3>
            <p className="text-sm text-text-muted">{notes}</p>
        </section>
    );
}
