'use client';

import { useState, useCallback } from 'react';
import { createOrder } from '@/lib/api/services/orders/mutation-services';
import { getErrorMessage } from '@/lib/hooks/internal/errors';
import { INITIAL_CHECKOUT_STATE } from './constants';
import {
  buildOrderPayload,
  createCheckoutStatePatch,
  getAvailableShippingMethods,
  getCompletedCheckoutState,
  getCurrentStepId,
  isCompleteOrderData,
  isValidShippingAddress,
} from './helpers';
import type {
  ShippingAddress,
  ShippingMethod,
  UseCheckoutReturn,
} from './types';

export function useCheckout(): UseCheckoutReturn {
  const [state, setState] = useState(INITIAL_CHECKOUT_STATE);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  const nextStep = useCallback(() => {
    setState((prev) => {
      const nextStepIndex = Math.min(prev.currentStep + 1, prev.steps.length - 1);
      return { ...prev, ...createCheckoutStatePatch(nextStepIndex) };
    });
  }, []);

  const prevStep = useCallback(() => {
    setState((prev) => {
      const previousStepIndex = Math.max(prev.currentStep - 1, 0);
      return { ...prev, ...createCheckoutStatePatch(previousStepIndex) };
    });
  }, []);

  const goToStep = useCallback((stepId: string) => {
    setState((prev) => {
      const stepIndex = prev.steps.findIndex((step) => step.id === stepId);
      if (stepIndex === -1) {
        return prev;
      }

      return { ...prev, ...createCheckoutStatePatch(stepIndex) };
    });
  }, []);

  const setShippingAddress = useCallback(async (address: ShippingAddress) => {
    setLoading(true);
    setError(null);

    try {
      if (!isValidShippingAddress(address)) {
        setError('Invalid shipping address');
        return false;
      }

      setState((prev) => ({
        ...prev,
        shippingAddress: address,
        shippingMethods: getAvailableShippingMethods(),
        orderData: {
          ...prev.orderData,
          shippingAddress: address,
        },
      }));

      return true;
    } catch (error: unknown) {
      setError(getErrorMessage(error, 'Failed to set shipping address'));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const selectShippingMethod = useCallback((method: ShippingMethod) => {
    setState((prev) => ({
      ...prev,
      selectedShippingMethod: method,
      orderData: {
        ...prev.orderData,
        shippingMethodId: method.id,
      },
    }));
  }, []);

  const setEmail = useCallback((email: string) => {
    setState((prev) => ({
      ...prev,
      orderData: {
        ...prev.orderData,
        email,
      },
    }));
  }, []);

  const setNotes = useCallback((notes: string) => {
    setState((prev) => ({
      ...prev,
      orderData: {
        ...prev.orderData,
        notes,
      },
    }));
  }, []);

  const completeCheckout = useCallback(async (paymentMethodId?: string) => {
    setLoading(true);
    setError(null);

    try {
      const nextOrderData = {
        ...state.orderData,
        paymentMethodId,
      };

      if (!isCompleteOrderData(nextOrderData)) {
        throw new Error('Email is required');
      }

      const response = await createOrder(buildOrderPayload(nextOrderData, paymentMethodId));
      setOrderId(response.order._id);
      setState((prev) => getCompletedCheckoutState(response.order, prev));

      return response.order;
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error, 'Failed to complete checkout');
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [state.orderData]);

  const reset = useCallback(() => {
    setState(INITIAL_CHECKOUT_STATE);
    setOrderId(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    currentStep: state.currentStep,
    currentStepId: getCurrentStepId(state),
    steps: state.steps,
    nextStep,
    prevStep,
    goToStep,
    shippingAddress: state.shippingAddress,
    shippingMethods: state.shippingMethods,
    selectedShippingMethod: state.selectedShippingMethod,
    setShippingAddress,
    selectShippingMethod,
    orderData: state.orderData,
    setEmail,
    setNotes,
    completeCheckout,
    orderId,
    loading,
    error,
    reset,
    clearError,
  };
}
