import type { ReactNode } from 'react';

interface ConditionalSectionViewProps {
  condition?: string;
  previewMode?: 'thenBranch' | 'elseBranch';
  thenBranch?: (props?: Record<string, unknown>) => ReactNode;
  elseBranch?: (props?: Record<string, unknown>) => ReactNode;
  puck?: {
    metadata?: {
      conditions?: Record<string, boolean>;
    };
  };
}

export const puckComponentName = 'ConditionalSection';
export const puckLabel = 'Conditional Section';
export const puckCategory = 'Layout';

export const puckFields = {
  condition: { type: 'text' as const, label: 'Condition signal name' },
  previewMode: {
    type: 'select' as const,
    label: 'Editor Preview State',
    options: [
      { label: 'Then (true branch)', value: 'thenBranch' },
      { label: 'Else (false branch)', value: 'elseBranch' },
    ],
  },
  thenBranch: { type: 'slot' as const },
  elseBranch: { type: 'slot' as const },
};

export const puckDefaults = {
  condition: '',
  previewMode: 'thenBranch' as const,
  thenBranch: [],
  elseBranch: [],
};

export function ConditionalSectionView({
  condition,
  previewMode = 'thenBranch',
  thenBranch: Then,
  elseBranch: Else,
  puck,
}: ConditionalSectionViewProps) {
  const conditions = puck?.metadata?.conditions ?? {};
  const hasRuntimeConditions = Object.keys(conditions).length > 0;

  const showThen = hasRuntimeConditions
    ? (condition ? conditions[condition] === true : true)
    : previewMode === 'thenBranch';

  return <>{showThen ? Then?.() : Else?.()}</>;
}
