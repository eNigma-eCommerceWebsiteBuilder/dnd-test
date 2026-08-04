import { ReturnRequestStatus, ReturnRequestType } from '@/lib/api/types/returns';
import type { ReturnsPageData } from '@/enigma-components/returns/canonical/returnsPageRuntime';

export const accountReturnsPreview: ReturnsPageData = {
    page: 1,
    status: undefined,
    returns: [
        {
            _id: 'puck-return-preview',
            requestNumber: 'RET-2048',
            orderId: {
                _id: 'puck-order-preview',
                orderNumber: 'EN-2048',
                orderStatus: 'delivered',
                totalAmount: 129,
            },
            type: ReturnRequestType.REFUND,
            status: ReturnRequestStatus.PENDING,
            calculations: { totalRefundAmount: 129 },
            createdAt: '2026-07-20T00:00:00.000Z',
        },
    ],
};
