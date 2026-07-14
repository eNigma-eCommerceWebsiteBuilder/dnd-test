import { ReturnRequestStatus, type ReturnStatus } from '@/lib/api/types/returns';

export interface ReturnStatusDisplay {
  text: string;
  color: string;
  icon: string;
  description: string;
}

const RETURN_STATUS_DISPLAY_MAP: Record<ReturnStatus, ReturnStatusDisplay> = {
  [ReturnRequestStatus.PENDING]: {
    text: 'Pending',
    color: 'yellow',
    icon: 'clock',
    description: 'Your return request is being reviewed',
  },
  [ReturnRequestStatus.APPROVED]: {
    text: 'Approved',
    color: 'green',
    icon: 'check-circle',
    description: 'Return approved. Please ship your items.',
  },
  [ReturnRequestStatus.REJECTED]: {
    text: 'Rejected',
    color: 'red',
    icon: 'x-circle',
    description: 'Return request was not approved',
  },
  [ReturnRequestStatus.PROCESSING]: {
    text: 'Processing',
    color: 'blue',
    icon: 'refresh-cw',
    description: 'Your return is being processed',
  },
  [ReturnRequestStatus.COMPLETED]: {
    text: 'Completed',
    color: 'green',
    icon: 'check',
    description: 'Return has been completed',
  },
  [ReturnRequestStatus.CANCELLED]: {
    text: 'Cancelled',
    color: 'gray',
    icon: 'ban',
    description: 'Return request was cancelled',
  },
};

export function formatReturnStatus(status: ReturnStatus): ReturnStatusDisplay {
  return RETURN_STATUS_DISPLAY_MAP[status];
}
