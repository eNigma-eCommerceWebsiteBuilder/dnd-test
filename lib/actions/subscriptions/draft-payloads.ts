import type {
  DraftUpdateRequest,
  SubscriptionDraft,
} from '@/lib/api/types';
import type { FieldErrors, FormDataOrObject } from '@/lib/actions/types';
import {
  SubscriptionDraftActionCode,
} from '@/lib/api/types';
import {
  SubscriptionFieldKey,
  getFormQuantity,
  getFormString,
} from './shared';

export function buildAddDraftLinePayload<T extends object>(
  input: FormDataOrObject<T>,
): { draftId?: string; update?: DraftUpdateRequest; fieldErrors?: FieldErrors } {
  const draftId = getFormString(input, SubscriptionFieldKey.DRAFT_ID);
  const productId = getFormString(input, SubscriptionFieldKey.PRODUCT_ID);
  const variantId = getFormString(input, SubscriptionFieldKey.VARIANT_ID);
  const quantity = getFormQuantity(input);
  const fieldErrors: FieldErrors = {};

  if (!draftId) {
    fieldErrors[SubscriptionFieldKey.DRAFT_ID] = 'Draft ID is required.';
  }
  if (!productId) {
    fieldErrors[SubscriptionFieldKey.PRODUCT_ID] = 'Product ID is required.';
  }
  if (!quantity || quantity < 1 || quantity > 999) {
    fieldErrors[SubscriptionFieldKey.QUANTITY] = 'Quantity must be between 1 and 999.';
  }

  return {
    draftId,
    ...(Object.keys(fieldErrors).length > 0
      ? { fieldErrors }
      : {
          update: {
            action: SubscriptionDraftActionCode.ADD,
            productId,
            variantId,
            quantity,
          },
        }),
  };
}

export function buildUpdateDraftLinePayload<T extends object>(
  input: FormDataOrObject<T>,
): { draftId?: string; update?: DraftUpdateRequest; fieldErrors?: FieldErrors } {
  const draftId = getFormString(input, SubscriptionFieldKey.DRAFT_ID);
  const lineId = getFormString(input, SubscriptionFieldKey.LINE_ID);
  const quantity = getFormQuantity(input);
  const fieldErrors: FieldErrors = {};

  if (!draftId) {
    fieldErrors[SubscriptionFieldKey.DRAFT_ID] = 'Draft ID is required.';
  }
  if (!lineId) {
    fieldErrors[SubscriptionFieldKey.LINE_ID] = 'Line ID is required.';
  }
  if (!quantity || quantity < 1 || quantity > 999) {
    fieldErrors[SubscriptionFieldKey.QUANTITY] = 'Quantity must be between 1 and 999.';
  }

  return {
    draftId,
    ...(Object.keys(fieldErrors).length > 0
      ? { fieldErrors }
      : {
          update: {
            action: SubscriptionDraftActionCode.UPDATE,
            lineId,
            quantity,
          },
        }),
  };
}

export function buildRemoveDraftLinePayload<T extends object>(
  input: FormDataOrObject<T>,
): { draftId?: string; update?: DraftUpdateRequest; fieldErrors?: FieldErrors } {
  const draftId = getFormString(input, SubscriptionFieldKey.DRAFT_ID);
  const lineId = getFormString(input, SubscriptionFieldKey.LINE_ID);
  const fieldErrors: FieldErrors = {};

  if (!draftId) {
    fieldErrors[SubscriptionFieldKey.DRAFT_ID] = 'Draft ID is required.';
  }
  if (!lineId) {
    fieldErrors[SubscriptionFieldKey.LINE_ID] = 'Line ID is required.';
  }

  return {
    draftId,
    ...(Object.keys(fieldErrors).length > 0
      ? { fieldErrors }
      : {
          update: {
            action: SubscriptionDraftActionCode.REMOVE,
            lineId,
          },
        }),
  };
}

export function buildDraftResult(
  draft: SubscriptionDraft,
  message: string,
): { success: true; draft: SubscriptionDraft; data: SubscriptionDraft; message: string } {
  return {
    success: true,
    draft,
    data: draft,
    message,
  };
}
