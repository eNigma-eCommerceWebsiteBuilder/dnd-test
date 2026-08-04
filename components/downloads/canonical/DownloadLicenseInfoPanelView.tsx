import type { LicenseInfo } from '@/lib/api/types/digital-products';
import { LicenseInfoPanel } from '@/components/downloads/LicenseInfoPanel';

import { downloadPreview } from './preview';
import { loadDownloadRuntime } from './downloadRuntime';

interface Props {
  licenseKey?: string;
  licenseInfo?: LicenseInfo | null;
  puck?: { isEditing?: boolean };
}

export const puckComponentName = 'DownloadLicenseInfoPanel';
export const puckLabel = 'Download License Information';
export const puckCategory = 'Downloads';
export const puckFields = {};
export const puckDefaults = {};
export const puckAst = {
  kind: 'runtime',
  sourceJsxNames: ['LicenseInfoPanel'],
  sourceImportPaths: ['@/components/downloads/LicenseInfoPanel'],
  role: 'download-license-info-panel',
  slotTarget: 'licenseInfoPanel',
  runtimeSignals: ['params.key', 'licenseInfo'],
};

export async function puckDataFetcher(
  _props: Props,
  context?: Parameters<typeof loadDownloadRuntime>[0],
) {
  return loadDownloadRuntime(context);
}

export function DownloadLicenseInfoPanelView({
  licenseKey = '',
  licenseInfo = null,
  puck,
}: Props) {
  const resolved = puck?.isEditing ? downloadPreview : { licenseKey, licenseInfo };

  return <LicenseInfoPanel licenseKey={resolved.licenseKey} initialLicenseInfo={resolved.licenseInfo} />;
}
