import type { ReturnRequest } from '@/lib/api/types';
import { returnDetailsPreview } from './preview';

export interface ReturnDetailsRuntimeProps { returnDetails?: ReturnRequest | null; previewState?: 'details' | 'notFound'; puck?: { isEditing?: boolean }; }
export function resolveReturnDetails({ returnDetails = null, previewState = 'details', puck }: ReturnDetailsRuntimeProps): ReturnRequest | null {
  if (!puck?.isEditing) return returnDetails;
  return previewState === 'notFound' ? null : returnDetailsPreview;
}
