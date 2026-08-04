import type { ReactNode } from 'react';
import type { Order } from '@/lib/api/types/orders';
import type { ReturnRequest } from '@/lib/api/types/returns';
import { AdminNotes } from '@/enigma-components/returns/AdminNotes';
import { RefundBreakdown } from '@/enigma-components/returns/RefundBreakdown';
import { RefundSummary } from '@/enigma-components/returns/RefundSummary';
import { ReturnActionsPanel } from '@/enigma-components/returns/ReturnActionsPanel';
import { ReturnDetailsHeader } from '@/enigma-components/returns/ReturnDetailsHeader';
import { ReturnItemList } from '@/enigma-components/returns/ReturnItemList';
import { ReturnLabelDownload } from '@/enigma-components/returns/ReturnLabelDownload';
import { ReturnNotFound } from '@/enigma-components/returns/ReturnNotFound';
import { ReturnReason } from '@/enigma-components/returns/ReturnReason';
import { ReturnStatusTimeline } from '@/enigma-components/returns/ReturnStatusTimeline';
import { TrackingInfo } from '@/enigma-components/returns/TrackingInfo';

export function ReturnDetailsNotFoundLayout() {
  return (
    <main className="min-h-screen bg-bg-base text-text-base">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-8 md:py-12">
        <ReturnNotFound />
      </div>
    </main>
  );
}

export function ReturnDetailsPageLayout({
  header,
  timeline,
  content,
  actions,
}: {
  header: ReactNode;
  timeline: ReactNode;
  content: ReactNode;
  actions: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-bg-base text-text-base">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-8 md:py-12 flex flex-col gap-8">
        {header}
        {timeline}
        {content}
        {actions}
      </div>
    </main>
  );
}

export function ReturnDetailsHeaderRegion({ returnRequest }: { returnRequest: ReturnRequest }) {
  return <ReturnDetailsHeader returnRequest={returnRequest} />;
}

export function ReturnDetailsTimelineRegion({ returnRequest }: { returnRequest: ReturnRequest }) {
  return (
    <ReturnStatusTimeline
      status={returnRequest.status}
      requestedAt={returnRequest.requestedAt}
      approvedAt={returnRequest.approvedAt}
      completedAt={returnRequest.completedAt}
      cancelledAt={returnRequest.cancelledAt}
      rejectedAt={returnRequest.rejectedAt}
    />
  );
}

export function ReturnDetailsContentLayout({ primary, sidebar }: { primary: ReactNode; sidebar: ReactNode }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      <div className="lg:col-span-7 space-y-6">{primary}</div>
      <div className="lg:col-span-5 space-y-6">{sidebar}</div>
    </div>
  );
}

export function ReturnDetailsItemsRegion({ returnRequest, order }: { returnRequest: ReturnRequest; order: Order | null }) {
  return <ReturnItemList returnItems={returnRequest.returnItems} order={order} />;
}

export function ReturnDetailsReasonRegion({ returnRequest }: { returnRequest: ReturnRequest }) {
  return <ReturnReason reason={returnRequest.reason} details={returnRequest.reasonDetails} />;
}

export function ReturnDetailsAdminNotesCondition({ notes, content }: { notes?: string; content: ReactNode }) {
  return notes ? <>{content}</> : null;
}

export function ReturnDetailsAdminNotesRegion({ notes }: { notes: string }) {
  return <AdminNotes notes={notes} />;
}

export function ReturnDetailsTrackingRegion({ returnId }: { returnId: string }) {
  return <TrackingInfo returnId={returnId} />;
}

export function ReturnDetailsLabelRegion({ returnId }: { returnId: string }) {
  return <ReturnLabelDownload returnId={returnId} />;
}

export function ReturnDetailsRefundSummaryRegion({ returnRequest, order }: { returnRequest: ReturnRequest; order: Order | null }) {
  return <RefundSummary returnRequest={returnRequest} order={order} />;
}

export function ReturnDetailsRefundBreakdownRegion({ returnRequest, order }: { returnRequest: ReturnRequest; order: Order | null }) {
  return <RefundBreakdown returnRequest={returnRequest} order={order} />;
}

export function ReturnDetailsActionsRegion({ returnRequest }: { returnRequest: ReturnRequest }) {
  return <ReturnActionsPanel returnId={returnRequest._id} status={returnRequest.status} />;
}
