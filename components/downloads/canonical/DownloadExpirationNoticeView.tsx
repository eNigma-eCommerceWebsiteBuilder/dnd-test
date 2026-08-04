import type { LicenseInfo } from '@/lib/api/types/digital-products';
import { ExpirationNotice } from '@/components/downloads/ExpirationNotice';

import { downloadPreview } from './preview';
import { loadDownloadRuntime } from './downloadRuntime';

interface Props {
  licenseInfo?: LicenseInfo | null;
  puck?: { isEditing?: boolean };
}

export const puckComponentName = 'DownloadExpirationNotice';
export const puckLabel = 'Download Expiration Notice';
export const puckCategory = 'Downloads';
export const puckFields = {};
export const puckDefaults = {};
export const puckAst = {
  kind: 'runtime',
  sourceJsxNames: ['ExpirationNotice'],
  sourceImportPaths: ['@/components/downloads/ExpirationNotice'],
  role: 'download-expiration-notice',
  slotTarget: 'expirationNotice',
  runtimeSignals: ['params.key', 'licenseInfo'],
};

export async function puckDataFetcher(
  _props: Props,
  context?: Parameters<typeof loadDownloadRuntime>[0],
) {
  return loadDownloadRuntime(context);
}

export function DownloadExpirationNoticeView({ licenseInfo = null, puck }: Props) {
  return <ExpirationNotice licenseInfo={puck?.isEditing ? downloadPreview.licenseInfo : licenseInfo} />;
}
