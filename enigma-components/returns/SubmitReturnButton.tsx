'use client';

import { useActionState } from 'react';
import type { ReturnActionResult } from '@/lib/actions/types';
import { requestReturnAction } from '@/lib/actions/returns-actions';
import { ReturnConfirmation } from '@/enigma-components/returns/ReturnConfirmation';
import type { ReturnReason } from '@/lib/api/types/returns';

interface ReturnItemPayload {
    orderItemId?: string;
    productId: string;
    variantId?: string;
    quantity: number;
    reason: string;
}

interface SubmitReturnButtonProps {
    orderId: string;
    items: ReturnItemPayload[];
    reason: ReturnReason;
    reasonDetails?: string;
    disabled?: boolean;
}

export function SubmitReturnButton({
    orderId,
    items,
    reason,
    reasonDetails,
    disabled = false,
}: SubmitReturnButtonProps) {
    const submitReturn = (
        _state: ReturnActionResult | null,
        payload: {
            orderId?: string;
            returnData?: {
                type: 'refund';
                reason: ReturnReason;
                reasonDetails?: string;
                returnItems: Array<{
                    orderItemId: string;
                    productId: string;
                    variantId?: string;
                    quantity: number;
                    reason: ReturnReason;
                }>;
            };
        }
    ) => requestReturnAction(null, payload);

    const [state, formAction, isPending] = useActionState(submitReturn, null);

    const returnId =
        (state?.data as { _id?: string } | undefined)?._id ??
        (state?.return as { _id?: string } | undefined)?._id ??
        null;

    if (state?.success) {
        return <ReturnConfirmation returnId={returnId} />;
    }

    return (
        <div className="@container w-full flex flex-col gap-3">
            {state?.error ? (
                <p className="text-sm text-danger">{state.error}</p>
            ) : null}
            <button
                type="button"
                onClick={() =>
                    formAction({
                        orderId,
                        returnData: {
                            type: 'refund',
                            reason,
                            reasonDetails,
                            returnItems: items
                                .filter((item): item is ReturnItemPayload & { orderItemId: string } => Boolean(item.orderItemId))
                                .map((item) => ({
                                    orderItemId: item.orderItemId,
                                    productId: item.productId,
                                    variantId: item.variantId,
                                    quantity: item.quantity,
                                    reason,
                                })),
                        },
                    })
                }
                disabled={disabled || isPending}
                className="w-full rounded-button bg-cta-primary px-4 py-3 text-sm font-semibold text-on-primary shadow-button hover:bg-cta-primary-hover hover:shadow-button-hover transition-all disabled:opacity-disabled disabled:cursor-not-allowed"
            >
                {isPending ? 'Submitting return...' : 'Submit return request'}
            </button>
        </div>
    );
}
