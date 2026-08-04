import { ReturnsList } from '@/enigma-components/returns/ReturnsList';
import type { ReturnsPageData } from './returnsPageRuntime';
import { ReturnsPageHeader, ReturnsPageLayout } from './ReturnsPageSections';

export function ReturnsPage({ data }: { data: ReturnsPageData }) {
    return (
        <ReturnsPageLayout
            header={<ReturnsPageHeader />}
            content={<ReturnsList returns={data.returns} status={data.status} page={data.page} limit={10} />}
        />
    );
}
