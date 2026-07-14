import type { ReviewEligibilityRequest } from '@/lib/api';
import { getTrimmedStringField, normalizeEmail } from '@/lib/actions/internal/forms';
import type { FieldErrors, FormDataOrObject } from '@/lib/actions/types';
import { ReviewFieldKey } from './shared';

interface ValidateEligibilityInput {
  orderId?: string;
  productId?: string;
  email?: string;
  customerEmail?: string;
}

export function buildReviewEligibilityRequest(
  formData: FormDataOrObject<ValidateEligibilityInput>,
): { data?: ReviewEligibilityRequest; fieldErrors?: FieldErrors } {
  const orderId = getTrimmedStringField(formData, ReviewFieldKey.ORDER_ID);
  const productId = getTrimmedStringField(formData, ReviewFieldKey.PRODUCT_ID);
  const emailValue =
    getTrimmedStringField(formData, ReviewFieldKey.EMAIL) ??
    getTrimmedStringField(formData, ReviewFieldKey.CUSTOMER_EMAIL);
  const fieldErrors: FieldErrors = {};

  if (!orderId) {
    fieldErrors[ReviewFieldKey.ORDER_ID] = 'Order ID is required.';
  }
  if (!productId) {
    fieldErrors[ReviewFieldKey.PRODUCT_ID] = 'Product ID is required.';
  }
  if (!emailValue) {
    fieldErrors[ReviewFieldKey.EMAIL] = 'Email is required.';
  }

  if (Object.keys(fieldErrors).length > 0 || !orderId || !productId || !emailValue) {
    return { fieldErrors };
  }

  return {
    data: {
      orderId,
      productId,
      email: normalizeEmail(emailValue),
    },
  };
}
