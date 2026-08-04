import type { ReturnRequest } from '@/lib/api/types/returns';
import { ReturnDetailsPageState } from './ReturnDetailsPageState';
import {
  ReturnDetailsActionsRegion,
  ReturnDetailsAdminNotesCondition,
  ReturnDetailsAdminNotesRegion,
  ReturnDetailsContentLayout,
  ReturnDetailsHeaderRegion,
  ReturnDetailsItemsRegion,
  ReturnDetailsLabelRegion,
  ReturnDetailsNotFoundLayout,
  ReturnDetailsPageLayout,
  ReturnDetailsReasonRegion,
  ReturnDetailsRefundBreakdownRegion,
  ReturnDetailsRefundSummaryRegion,
  ReturnDetailsTimelineRegion,
  ReturnDetailsTrackingRegion,
} from './ReturnDetailsPageSections';
import { getReturnOrder } from './returnDetailsRuntime';

export function ReturnDetailsPage({ returnDetails }: { returnDetails: ReturnRequest | null }) {
  const order = returnDetails ? getReturnOrder(returnDetails) : null;

  return (
    <ReturnDetailsPageState
      returnDetails={returnDetails}
      notFound={<ReturnDetailsNotFoundLayout />}
      content={returnDetails ? (
        <ReturnDetailsPageLayout
          header={<ReturnDetailsHeaderRegion returnRequest={returnDetails} />}
          timeline={<ReturnDetailsTimelineRegion returnRequest={returnDetails} />}
          content={(
            <ReturnDetailsContentLayout
              primary={(
                <>
                  <ReturnDetailsItemsRegion returnRequest={returnDetails} order={order} />
                  <ReturnDetailsReasonRegion returnRequest={returnDetails} />
                  <ReturnDetailsAdminNotesCondition
                    notes={returnDetails.adminNotes}
                    content={<ReturnDetailsAdminNotesRegion notes={returnDetails.adminNotes!} />}
                  />
                </>
              )}
              sidebar={(
                <>
                  <ReturnDetailsTrackingRegion returnId={returnDetails._id} />
                  <ReturnDetailsLabelRegion returnId={returnDetails._id} />
                  <ReturnDetailsRefundSummaryRegion returnRequest={returnDetails} order={order} />
                  <ReturnDetailsRefundBreakdownRegion returnRequest={returnDetails} order={order} />
                </>
              )}
            />
          )}
          actions={<ReturnDetailsActionsRegion returnRequest={returnDetails} />}
        />
      ) : null}
    />
  );
}
