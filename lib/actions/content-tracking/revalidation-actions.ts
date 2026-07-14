'use server';

import {
  ACTION_CACHE_TAGS,
  revalidateActionTags,
} from '@/lib/actions/internal/cache';
import {
  createEmptySuccessResult,
  createErrorResult,
  getActionErrorMessage,
} from '@/lib/actions/internal/errors';
import type { ActionResult } from '@/lib/actions/types';

async function runRevalidation(
  tags: readonly string[],
  successMessage: string,
  errorMessage: string,
): Promise<ActionResult> {
  try {
    revalidateActionTags(tags);
    return createEmptySuccessResult({ message: successMessage });
  } catch (error: unknown) {
    return createErrorResult(getActionErrorMessage(error, errorMessage));
  }
}

export async function revalidateCollectionsAction(): Promise<ActionResult> {
  return runRevalidation(
    [ACTION_CACHE_TAGS.collections],
    'Collections cache revalidated',
    'Failed to revalidate cache',
  );
}

export async function revalidatePromotionsAction(): Promise<ActionResult> {
  return runRevalidation(
    [ACTION_CACHE_TAGS.promotions],
    'Promotions cache revalidated',
    'Failed to revalidate cache',
  );
}

export async function revalidateTestimonialsAction(): Promise<ActionResult> {
  return runRevalidation(
    [ACTION_CACHE_TAGS.testimonials],
    'Testimonials cache revalidated',
    'Failed to revalidate cache',
  );
}

export async function revalidateMenuAction(): Promise<ActionResult> {
  return runRevalidation(
    [ACTION_CACHE_TAGS.menu],
    'Menu cache revalidated',
    'Failed to revalidate cache',
  );
}

export async function revalidateAllContentAction(): Promise<ActionResult> {
  return runRevalidation(
    [
      ACTION_CACHE_TAGS.collections,
      ACTION_CACHE_TAGS.promotions,
      ACTION_CACHE_TAGS.testimonials,
      ACTION_CACHE_TAGS.menu,
    ],
    'All content caches revalidated',
    'Failed to revalidate caches',
  );
}
