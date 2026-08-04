import type { LicenseInfo } from '@/lib/api/types/digital-products';
import { DownloadAssetState } from '@/enigma-components/templates/downloads/DownloadPageSections';

import { downloadPreview } from './preview';
import { loadDownloadRuntime } from './downloadRuntime';

interface Props {
  licenseKey?: string;
  licenseInfo?: LicenseInfo | null;
  puck?: { isEditing?: boolean };
}

export const puckComponentName = 'DownloadAssetState';
export const puckLabel = 'Download Asset State';
export const puckCategory = 'Downloads';
export const puckFields = {};
export const puckDefaults = {};
export const puckAst = {
  kind: 'runtime',
  sourceJsxNames: ['DownloadAssetState', 'InvalidLicense', 'LicenseValidation', 'DownloadButton'],
  sourceImportPaths: ['@/components/templates/downloads/DownloadPageSections'],
  role: 'download-asset-state',
  slotTarget: 'assetState',
  conditional: '!licenseInfo || !isValid || !hasRemaining',
  runtimeSignals: ['params.key', 'licenseInfo'],
};

export async function puckDataFetcher(
  _props: Props,
  context?: Parameters<typeof loadDownloadRuntime>[0],
) {
  return loadDownloadRuntime(context);
}

export function DownloadAssetStateView({
  licenseKey = '',
  licenseInfo = null,
  puck,
}: Props) {
  const resolved = puck?.isEditing ? downloadPreview : { licenseKey, licenseInfo };

  return <DownloadAssetState {...resolved} />;
}
