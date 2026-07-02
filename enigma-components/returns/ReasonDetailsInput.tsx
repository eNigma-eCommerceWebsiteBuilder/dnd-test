'use client';

interface ReasonDetailsInputProps {
    value: string;
    onChange: (nextValue: string) => void;
}

export function ReasonDetailsInput({ value, onChange }: ReasonDetailsInputProps) {
    return (
        <div className="@container w-full flex flex-col gap-2">
            <label className="text-sm font-semibold text-text-base" htmlFor="return-reason-details">
                Reason details (optional)
            </label>
            <textarea
                id="return-reason-details"
                rows={4}
                className="w-full rounded-input border border-input-border bg-input-bg px-3 py-2.5 text-sm text-text-base shadow-input focus:border-border-focus focus:outline-none"
                placeholder="Share any details that help us understand the issue"
                value={value}
                onChange={(event) => onChange(event.target.value)}
            />
        </div>
    );
}
