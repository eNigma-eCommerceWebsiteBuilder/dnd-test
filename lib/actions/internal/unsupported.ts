import { createErrorResult } from './errors';
import type { ActionResult } from '../types';

export function createUnsupportedActionResult<TData = undefined>(
  message: string,
): ActionResult<TData> {
  return createErrorResult(message);
}
