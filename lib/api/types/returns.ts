import type { Order } from './orders';

export enum ReturnRequestType {
    REFUND = 'refund',
    EXCHANGE = 'exchange',
}

export enum ReturnReasonCode {
    WRONG_SIZE = 'wrong_size',
    DAMAGED = 'damaged',
    DEFECTIVE = 'defective',
    NOT_AS_DESCRIBED = 'not_as_described',
    CHANGED_MIND = 'changed_mind',
    RECEIVED_WRONG_ITEM = 'received_wrong_item',
    BETTER_PRICE_FOUND = 'better_price_found',
    QUALITY_NOT_SATISFACTORY = 'quality_not_satisfactory',
    OTHER = 'other',
}

export type ReturnReason = `${ReturnReasonCode}`;

export enum ReturnRequestStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    PROCESSING = 'processing',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
}

export type ReturnStatus = `${ReturnRequestStatus}`;

export interface ReturnItem {
    orderItemId: string;
    productId: string;
    variantId?: string;
    quantity: number;
    reason: ReturnReason;
    reasonDetails?: string;
    images?: string[];
}

export interface ExchangeItemRequest {
    productId: string;
    variantId?: string;
    quantity: number;
}

export interface ReturnCalculations {
    itemsRefundAmount: number;
    shippingRefundAmount: number;
    restockingFee: number;
    totalRefundAmount: number;
}

export interface ReturnRequest {
    _id: string;
    requestNumber: string;
    orderId: string | Order;
    userId?: string;
    customerEmail: string;
    customerName: string;
    type: `${ReturnRequestType}`;
    status: ReturnStatus;
    returnItems: ReturnItem[];
    exchangeItems?: ExchangeItemRequest[];
    reason: ReturnReason;
    reasonDetails?: string;
    customerNote?: string;
    calculations: ReturnCalculations;
    adminNotes?: string;
    requestedAt: string;
    approvedAt?: string;
    rejectedAt?: string;
    completedAt?: string;
    cancelledAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ReturnRequestData {
    returnItems: ReturnItem[];
    exchangeItems?: ExchangeItemRequest[];
    type: `${ReturnRequestType}`;
    reason: ReturnReason;
    reasonDetails?: string;
    customerNote?: string;
}

export interface ReturnRequestResponse {
    success: boolean;
    message: string;
    data: ReturnRequest;
}

export interface ReturnsListResponse {
    success: boolean;
    data: Array<{
        _id: string;
        requestNumber: string;
        orderId: {
            _id: string;
            orderNumber: string;
            orderStatus: string;
            totalAmount: number;
        };
        type: `${ReturnRequestType}`;
        status: ReturnStatus;
        calculations: {
            totalRefundAmount: number;
        };
        createdAt: string;
    }>;
}

export interface ReturnDetailsResponse {
    success: boolean;
    data: ReturnRequest;
}

export interface CancelReturnResponse {
    success: boolean;
    message: string;
    data: {
        _id: string;
        status: ReturnStatus;
        cancelledAt: string;
    };
}
