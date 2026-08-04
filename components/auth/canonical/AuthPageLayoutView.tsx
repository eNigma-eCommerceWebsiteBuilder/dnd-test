import type { ReactNode } from 'react';
import { AuthPageLayout } from '@/enigma-components/auth/AuthPageLayout';
type Slot = (() => ReactNode) | undefined;
interface Props { content?: Slot; }
export const puckComponentName = 'AuthPageLayout'; export const puckLabel = 'Auth Page Layout'; export const puckCategory = 'Auth';
export const puckFields = { content: { type: 'slot' as const, allow: ['AuthEntryCard'] } };
export const puckDefaults = { content: [] };
export const puckAst = { kind: 'static', slots: ['content'], sourceJsxNames: ['AuthPageLayout'], sourceImportPaths: ['@/components/auth/AuthPageLayout'], role: 'auth-page-layout', slotTarget: 'content' };
export function AuthPageLayoutView({ content }: Props) { return <AuthPageLayout content={content?.()} />; }
