'use client';

import { useMemo, useState } from 'react';
import type { Order } from '@/lib/api/types/orders';
import type { ReturnReason } from '@/lib/api/types/returns';
import { OrderItemSelector, type SelectedReturnItem } from '@/components/returns/OrderItemSelector';
import { ReasonSelector } from '@/components/returns/ReasonSelector';
import { ReasonDetailsInput } from '@/components/returns/ReasonDetailsInput';
import { ImageUploader } from '@/components/returns/ImageUploader';
import { ReturnMethodSelector } from '@/components/returns/ReturnMethodSelector';
import { RefundPreview } from '@/components/returns/RefundPreview';
import { RefundBreakdown } from '@/components/returns/RefundBreakdown';
import { SubmitReturnButton } from '@/components/returns/SubmitReturnButton';

interface ReturnRequestFormProps {
    order: Order;
}

type Step = 1 | 2;

function buildSelectedItems(items: Order['items']): Record<string, SelectedReturnItem> {
    return items.reduce<Record<string, SelectedReturnItem>>((acc, item) => {
        const key = `${item.productId}-${item.variantId ?? 'base'}`;
        acc[key] = {
            key,
            orderItemId: item._id,
            productId: item.productId,
            variantId: item.variantId,
            quantity: 1,
        };
        return acc;
    }, {});
}

export function ReturnRequestForm({ order }: ReturnRequestFormProps) {
    const [step, setStep] = useState<Step>(1);
    const [selectedItems, setSelectedItems] = useState<Record<string, SelectedReturnItem>>({});
    const [reason, setReason] = useState<ReturnReason | ''>('');
    const [reasonDetails, setReasonDetails] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [returnMethod, setReturnMethod] = useState<'ship_back' | 'store_dropoff' | ''>('');

    const totalItems = order.items.length;

    const selectedCount = useMemo(() => Object.values(selectedItems).length, [selectedItems]);

    const previewItems = useMemo(() => {
        return Object.values(selectedItems).map((selectedItem) => {
            const orderItem = order.items.find((item) => {
                if (item.productId !== selectedItem.productId) return false;
                if (!selectedItem.variantId) return true;
                return item.variantId === selectedItem.variantId;
            });

            return {
                price: orderItem?.price ?? 0,
                quantity: selectedItem.quantity,
            };
        });
    }, [order.items, selectedItems]);

    const submissionItems = useMemo(() => {
        if (!reason) return [];
        return Object.values(selectedItems).map((selectedItem) => ({
            orderItemId: selectedItem.orderItemId,
            productId: selectedItem.productId,
            variantId: selectedItem.variantId,
            quantity: selectedItem.quantity,
            reason: reason,
        }));
    }, [reason, selectedItems]);

    const hasMissingOrderItemIds = submissionItems.some((item) => !item.orderItemId);

    const handleSelectItem = (itemKey: string, selected: boolean) => {
        setSelectedItems((prev) => {
            if (!selected) {
                const { [itemKey]: removed, ...rest } = prev;
                void removed;
                return rest;
            }
            const defaultItems = buildSelectedItems(order.items);
            return {
                ...prev,
                [itemKey]: prev[itemKey] ?? defaultItems[itemKey],
            };
        });
    };

    const handleQuantityChange = (itemKey: string, nextQuantity: number) => {
        setSelectedItems((prev) => {
            if (!prev[itemKey]) return prev;
            return {
                ...prev,
                [itemKey]: {
                    ...prev[itemKey],
                    quantity: nextQuantity,
                },
            };
        });
    };

    const stepLabel = step === 1 ? 'Item Selection' : 'Return Details';
    const stepProgress = step === 1 ? 50 : 100;

    return (
        <section className="@container w-full flex flex-col gap-6">
            <div className="flex flex-col gap-3 rounded-card border border-border bg-surface p-4 shadow-card">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                            Step {step} of 2
                        </p>
                        <h2 className="text-lg font-bold font-heading text-text-base">
                            {stepLabel}
                        </h2>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-xs font-semibold text-text-muted">
                            {selectedCount} selected of {totalItems}
                        </span>
                        <div className="h-2 w-40 rounded-full bg-sunken">
                            <div
                                className="h-full rounded-full bg-primary"
                                style={{ width: `${stepProgress}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                {step === 1 ? (
                    <OrderItemSelector
                        items={order.items}
                        selectedItems={selectedItems}
                        onSelectItem={handleSelectItem}
                        onQuantityChange={handleQuantityChange}
                    />
                ) : (
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-4 rounded-card border border-border bg-surface p-4 shadow-card">
                            <h3 className="text-base font-semibold text-text-base">Return Reason</h3>
                            <ReasonSelector value={reason} onChange={setReason} />
                            <ReasonDetailsInput value={reasonDetails} onChange={setReasonDetails} />
                            <ImageUploader files={files} onFilesChange={setFiles} />
                        </div>

                        <ReturnMethodSelector value={returnMethod} onChange={setReturnMethod} />

                        <RefundPreview items={previewItems} shippingCost={order.shipping} />
                        <RefundBreakdown items={previewItems} shippingCost={order.shipping} />

                        <SubmitReturnButton
                            orderId={order._id}
                            items={submissionItems}
                            reason={reason as ReturnReason}
                            reasonDetails={reasonDetails.trim() || undefined}
                            disabled={selectedCount === 0 || !reason || hasMissingOrderItemIds}
                        />
                    </div>
                )}

                <div className="flex items-center justify-between gap-3">
                    <button
                        type="button"
                        className="rounded-button border border-border px-4 py-2 text-sm font-semibold text-text-base hover:border-border-hover hover:text-primary transition-colors"
                        onClick={() => setStep(1)}
                        disabled={step === 1}
                    >
                        Back
                    </button>
                    <button
                        type="button"
                        className="rounded-button bg-cta-primary px-4 py-2 text-sm font-semibold text-on-primary hover:bg-cta-primary-hover transition-colors"
                        onClick={() => setStep(2)}
                        disabled={step === 2 || selectedCount === 0}
                    >
                        Continue
                    </button>
                </div>
            </div>
        </section>
    );
}
