'use client';

import { ReturnReasonCode, type ReturnReason } from '@/lib/api/types/returns';
import { validateReturnReason } from '@/lib/utils/returns';

const RETURN_REASONS: ReturnReason[] = Object.values(ReturnReasonCode);

interface ReasonSelectorProps {
    value: ReturnReason | '';
    onChange: (nextValue: ReturnReason) => void;
    category?: string;
}

function formatReasonLabel(reason: string): string {
    return reason
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function ReasonSelector({ value, onChange, category }: ReasonSelectorProps) {
    const isValid = value ? validateReturnReason(value, category) : true;

    return (
        <div className="@container w-full flex flex-col gap-2">
            <label className="text-sm font-semibold text-text-base" htmlFor="return-reason">
                Reason for return
            </label>
            <select
                id="return-reason"
                className="w-full rounded-input border border-input-border bg-input-bg px-3 py-2.5 text-sm text-text-base shadow-input focus:border-border-focus focus:outline-none"
                value={value}
                onChange={(event) => onChange(event.target.value as ReturnReason)}
            >
                <option value="" disabled>
                    Select a reason
                </option>
                {RETURN_REASONS.map((reason) => (
                    <option key={reason} value={reason}>
                        {formatReasonLabel(reason)}
                    </option>
                ))}
            </select>
            {!isValid ? (
                <span className="text-xs text-danger">Selected reason is not valid for this item.</span>
            ) : null}
        </div>
    );
}
