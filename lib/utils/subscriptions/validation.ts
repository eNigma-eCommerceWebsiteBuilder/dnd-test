import type { Product } from '@/lib/api/types/products';
import type { SellingPlan } from '@/lib/api/types/selling-plans';

export function validateSellingPlanCompatibility(
  product: Product | null | undefined,
  sellingPlan: SellingPlan | null | undefined,
): boolean {
  if (!product || !sellingPlan) {
    return false;
  }

  return product.isActive && sellingPlan.isActive;
}
