import { apiRequest, apiMutate } from '../../core/client';
import { ApiError } from '../../core/errors';
import { validateObjectId, validateQuantity } from '../../utils/validators';
import type {
  ProductSellingPlansResponse,
  SubscriptionPreviewRequest,
  SubscriptionPreview,
} from '../../types';

export async function getProductSellingPlans(productId: string): Promise<ProductSellingPlansResponse> {
  validateObjectId(productId, 'Product ID');

  return apiRequest<ProductSellingPlansResponse>(`/checkout/products/${productId}/selling-plans`, {
    revalidate: 300,
    tags: ['selling-plans', `product-${productId}`],
  });
}

export async function previewSubscriptionPricing(
  data: SubscriptionPreviewRequest
): Promise<SubscriptionPreview> {
  if (!data || typeof data !== 'object') {
    throw new ApiError('Preview data is required', 400, 'MISSING_DATA');
  }

  if (!data.productId) {
    throw new ApiError('Product ID is required', 400, 'MISSING_PRODUCT_ID');
  }
  validateObjectId(data.productId, 'Product ID');

  if (!data.sellingPlanId) {
    throw new ApiError('Selling Plan ID is required', 400, 'MISSING_SELLING_PLAN_ID');
  }

  if (!data.quantity || data.quantity < 1) {
    data.quantity = 1;
  }
  validateQuantity(data.quantity);

  if (data.variantId) {
    validateObjectId(data.variantId, 'Variant ID');
  }

  return apiMutate<SubscriptionPreview>('/checkout/subscription/preview', {
    method: 'POST',
    body: data,
  });
}
