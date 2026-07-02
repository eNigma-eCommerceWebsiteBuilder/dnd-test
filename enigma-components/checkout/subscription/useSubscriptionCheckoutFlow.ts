'use client';

import { useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { useAnalytics } from '@/lib/analytics';
import { addSubscriptionToCartAction, createSubscriptionCheckoutAction } from '@/lib/actions/subscription-checkout-actions';
import { useCart, useSellingPlans, useSubscriptionPreview } from '@/lib/hooks';
import type { Cart } from '@/lib/api/types/cart';
import type { ProductSellingPlansResponse, SellingPlan, SubscriptionPreview } from '@/lib/api/types/selling-plans';
import {
  buildAddToCartFormData,
  buildCheckoutFormData,
  CHECKOUT_STARTED_EVENT,
  getBillingPolicyText,
  getBillingTermsText,
  getCheckoutValidationError,
  getEmptyCustomerInfo,
  getEmptyShippingAddress,
  getSellingPlanId,
} from './subscriptionCheckoutUtils';

interface UseSubscriptionCheckoutFlowOptions {
  cart: Cart;
  sellingPlans: ProductSellingPlansResponse | null;
  pricingPreview: SubscriptionPreview | null;
}

export function useSubscriptionCheckoutFlow({
  cart,
  sellingPlans,
  pricingPreview,
}: UseSubscriptionCheckoutFlowOptions) {
  const [customerInfo, setCustomerInfo] = useState(getEmptyCustomerInfo);
  const [shippingAddress, setShippingAddress] = useState(getEmptyShippingAddress);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const beginCheckoutTracked = useRef(false);

  const { refreshCart } = useCart(false);
  const sellingPlansState = useSellingPlans();
  const subscriptionPreview = useSubscriptionPreview();
  const { trackEvent } = useAnalytics();

  const primaryItem = cart.items[0];
  const sellingPlanId = getSellingPlanId(primaryItem);
  const availablePlans = useMemo(
    () => sellingPlans?.sellingPlans?.length ? sellingPlans.sellingPlans : sellingPlansState.sellingPlans,
    [sellingPlans, sellingPlansState.sellingPlans],
  );
  const activePlan: SellingPlan | null = useMemo(() => {
    if (!sellingPlanId) {
      return null;
    }

    return availablePlans.find((plan) => plan.id === sellingPlanId) || null;
  }, [availablePlans, sellingPlanId]);

  const fallbackPlanId = !sellingPlanId && availablePlans.length === 1 ? availablePlans[0].id : undefined;
  const effectivePlanId = sellingPlanId || fallbackPlanId;
  const effectivePlan = activePlan || (fallbackPlanId ? availablePlans[0] : null);
  const previewData = pricingPreview || subscriptionPreview.preview;
  const termsText = getBillingTermsText(previewData, effectivePlan);
  const policyText = getBillingPolicyText(primaryItem, effectivePlan);

  useEffect(() => {
    if (!primaryItem || beginCheckoutTracked.current) {
      return;
    }

    beginCheckoutTracked.current = true;
    void trackEvent(CHECKOUT_STARTED_EVENT, {
      cartValue: cart.total,
      itemCount: cart.totalItems,
    });
  }, [cart.total, cart.totalItems, primaryItem, trackEvent]);

  useEffect(() => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    }
  }, [checkoutUrl]);

  const handleCheckout = () => {
    const validationError = getCheckoutValidationError({
      customerInfo,
      shippingAddress,
      termsAccepted,
      primaryItem,
      effectivePlan,
      effectivePlanId,
    });

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    if (!primaryItem || !effectivePlanId) {
      return;
    }

    startTransition(() => {
      void (async () => {
        setErrorMessage(null);

        if (!previewData) {
          try {
            await subscriptionPreview.previewPricing(
              primaryItem.productId,
              effectivePlanId,
              primaryItem.quantity,
              primaryItem.variantId,
            );
          } catch {
            setErrorMessage('Unable to refresh pricing preview.');
            return;
          }
        }

        if (!sellingPlans && availablePlans.length === 0) {
          try {
            await sellingPlansState.loadPlans(primaryItem.productId);
          } catch {
            setErrorMessage('Unable to load subscription plans.');
            return;
          }
        }

        if (!sellingPlanId) {
          const addToCartResult = await addSubscriptionToCartAction(
            null,
            buildAddToCartFormData(primaryItem, effectivePlanId),
          );

          if (!addToCartResult.success) {
            setErrorMessage(addToCartResult.error || 'Unable to add the subscription to cart.');
            return;
          }

          await refreshCart();
        }

        const checkoutResult = await createSubscriptionCheckoutAction(
          null,
          buildCheckoutFormData(customerInfo, shippingAddress, window.location.origin),
        );

        if (!checkoutResult.success || !checkoutResult.checkoutUrl) {
          setErrorMessage(checkoutResult.error || 'Unable to start subscription checkout.');
          return;
        }

        setCheckoutUrl(checkoutResult.checkoutUrl);
      })();
    });
  };

  return {
    customerInfo,
    setCustomerInfo,
    shippingAddress,
    setShippingAddress,
    termsAccepted,
    setTermsAccepted,
    termsText,
    policyText,
    handleCheckout,
    isProcessing: isPending,
    displayError: errorMessage || subscriptionPreview.error || sellingPlansState.error,
  };
}
