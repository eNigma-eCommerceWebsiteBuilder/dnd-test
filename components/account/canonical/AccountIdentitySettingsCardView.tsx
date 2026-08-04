import { AccountIdentitySettingsCard } from '@/enigma-components/account/AccountIdentitySettingsCard';
import { puckTransparentSlotProps, type AccountSlot } from './types';

interface Props {
  explanation?: AccountSlot;
  details?: AccountSlot;
}

export const puckComponentName = 'AccountIdentitySettingsCard';
export const puckLabel = 'Account Identity Settings Card';
export const puckCategory = 'Account';
export const puckFields = {
  explanation: { type: 'slot' as const, allow: ['AccountIdentityExplanation'] },
  details: { type: 'slot' as const, allow: ['AccountIdentitySessionDetails'] },
};
export const puckDefaults = { explanation: [], details: [] };
export const puckAst = {
  kind: 'static',
  slots: ['explanation', 'details'],
  sourceJsxNames: ['AccountIdentitySettingsCard'],
  sourceImportPaths: ['@/components/account/AccountIdentitySettingsCard'],
  role: 'account-identity-settings-card',
  slotTarget: 'content',
  requiredClasses: ['mt-8', 'rounded-card', 'lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]'],
};

export function AccountIdentitySettingsCardView({ explanation, details }: Props) {
  return <AccountIdentitySettingsCard explanation={explanation?.(puckTransparentSlotProps)} details={details?.(puckTransparentSlotProps)} />;
}
